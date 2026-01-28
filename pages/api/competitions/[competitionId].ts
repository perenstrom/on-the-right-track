import { NextApiRequest, NextApiResponse } from 'next';
import { prismaContext } from 'lib/prisma';
import { softDeleteCompetition } from 'services/prisma';
import { DeleteCompetitionQuerySchema } from 'schemas/zod/schema';
import { publishDeletedCompetition } from 'services/ably/client';
import { publishDeletedCompetitionAdmin } from 'services/ably/admin';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
