import { NextApiRequest, NextApiResponse } from 'next';
import { prismaContext } from 'lib/prisma';
import { softDeleteCompetition, updateCompetition } from 'services/prisma';
import {
  DeleteCompetitionQuerySchema,
  UpdateCompetitionSchema,
  CompetitionIdSchema
} from 'schemas/zod/schema';
import { publishDeletedCompetition } from 'services/ably/client';
import { publishDeletedCompetitionAdmin } from 'services/ably/admin';
import { publishUpdatedCompetition } from 'services/ably/admin';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'PATCH') {
    const parsedQuery = CompetitionIdSchema.safeParse(req.query);
    const parsedBody = UpdateCompetitionSchema.safeParse(req.body);

    if (!parsedQuery.success) {
      res.status(400).end('Query parameters malformed');
      return;
    }

    if (!parsedBody.success) {
      res.status(400).end('Request body malformed');
      return;
    }

    try {
      const updatedCompetition = await updateCompetition(
        prismaContext,
        parsedQuery.data.competitionId,
        parsedBody.data
      );

      // Broadcast update to all clients
      await publishUpdatedCompetition(parsedQuery.data.competitionId);

      res.status(200).json(updatedCompetition);
      return;
    } catch (error) {
      console.error('Error updating competition:', error);
      res.status(500).end('Unexpected internal server error');
      return;
    }
  }

  if (req.method === 'DELETE') {
    const parsedQuery = DeleteCompetitionQuerySchema.safeParse(req.query);

    if (!parsedQuery.success) {
      res.status(400).end('Action data malformed');
      return;
    }

    try {
      await softDeleteCompetition(
        prismaContext,
        parsedQuery.data.competitionId
      );

      // Broadcast deletion to all clients
      await Promise.all([
        publishDeletedCompetition(parsedQuery.data.competitionId),
        publishDeletedCompetitionAdmin(parsedQuery.data.competitionId)
      ]);

      res.status(200).json({ success: true });
      return;
    } catch (error) {
      console.error('Error deleting competition:', error);
      res.status(500).end('Unexpected internal server error');
      return;
    }
  }

  res.status(405).end('Method not allowed');
}
