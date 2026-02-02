import { NextApiRequest, NextApiResponse } from 'next';
import { prismaContext } from 'lib/prisma';
import { canEditStages, getCompetition } from 'services/prisma';
import { CompetitionIdSchema, UpdateSegmentsSchema } from 'schemas/zod/schema';
import { publishUpdatedSegments } from 'services/ably/admin';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'PUT') {
    const parsedQuery = CompetitionIdSchema.safeParse(req.query);
    const parsedBody = UpdateSegmentsSchema.safeParse(req.body);

    if (!parsedQuery.success) {
      res.status(400).end('Query parameters malformed');
      return;
    }

    if (!parsedBody.success) {
      res.status(400).end('Request body malformed');
      return;
    }

    // Check if stages can be edited
    try {
      const canEdit = await canEditStages(
        prismaContext,
        parsedQuery.data.competitionId
      );

      if (!canEdit) {
        res
          .status(403)
          .end('Cannot edit stages: teams have already made entries');
        return;
      }
    } catch (error) {
      console.error('Error checking if stages can be edited:', error);
      res.status(500).end('Unexpected internal server error');
      return;
    }

    // Perform differential update
    try {
      const competition = await getCompetition(
        prismaContext,
        parsedQuery.data.competitionId
      );
      const existingSegments = competition.segments;
      const incomingSegments = parsedBody.data.segments;

      // Identify segments to delete, update, and create
      const toDelete = existingSegments.filter(
        (existing) => !incomingSegments.find((s) => s.id === existing.id)
      );

      const toUpdate = incomingSegments.filter((s) => s.id);
      const toCreate = incomingSegments.filter((s) => !s.id);

      // Execute updates in a transaction
      await prismaContext.prisma.$transaction(async (tx) => {
        // Delete removed segments
        for (const segment of toDelete) {
          await tx.segment.delete({ where: { id: segment.id } });
        }

        // Update existing segments - Two-phase approach to avoid unique constraint violations
        // Phase 1: Temporarily move all updating segments to negative order values
        for (let i = 0; i < toUpdate.length; i++) {
          await tx.segment.update({
            where: { id: toUpdate[i].id },
            data: { order: -(i + 1) }
          });
        }

        // Phase 2: Update segments with their final values
        for (const segment of toUpdate) {
          await tx.segment.update({
            where: { id: segment.id },
            data: {
              type: segment.type,
              order: segment.order,
              numberOfOptions: segment.numberOfOptions,
              orderOfType: segment.orderOfType,
              nearestTrip: segment.nearestTrip
            }
          });
        }

        // Create new segments
        for (const segment of toCreate) {
          await tx.segment.create({
            data: {
              competitionId: parsedQuery.data.competitionId,
              type: segment.type,
              order: segment.order,
              numberOfOptions: segment.numberOfOptions,
              orderOfType: segment.orderOfType,
              nearestTrip: segment.nearestTrip,
              scorePublished: false
            }
          });
        }
      });

      // Broadcast update to all clients
      await publishUpdatedSegments(parsedQuery.data.competitionId);

      res.status(200).json({ success: true });
      return;
    } catch (error) {
      console.error('Error updating segments:', error);
      res.status(500).end('Unexpected internal server error');
      return;
    }
  }

  res.status(405).end('Method not allowed');
}
