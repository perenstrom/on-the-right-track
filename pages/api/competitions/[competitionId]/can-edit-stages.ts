import { NextApiRequest, NextApiResponse } from 'next';
import { prismaContext } from 'lib/prisma';
import { canEditStages } from 'services/prisma';
import { CompetitionIdSchema } from 'schemas/zod/schema';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const parsedQuery = CompetitionIdSchema.safeParse(req.query);

    if (!parsedQuery.success) {
      res.status(400).end('Query parameters malformed');
      return;
    }

    try {
      const canEdit = await canEditStages(
        prismaContext,
        parsedQuery.data.competitionId
      );

      res.status(200).json({ canEdit });
      return;
    } catch (error) {
      console.error('Error checking if stages can be edited:', error);
      res.status(500).end('Unexpected internal server error');
      return;
    }
  }

  res.status(405).end('Method not allowed');
}
