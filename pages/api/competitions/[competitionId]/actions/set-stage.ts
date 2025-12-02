import { NextApiRequest, NextApiResponse } from 'next';
import { prismaContext } from 'lib/prisma';
import { setCurrentStage } from 'services/prisma';
import { SetStageQuerySchema, SetStageSchema } from 'schemas/zod/schema';
import { publishNewStage as publishNewStageClient } from 'services/ably/client';
import { publishNewStage as publishNewStageAdmin } from 'services/ably/admin';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const parsedBody = SetStageSchema.safeParse(req.body);
    const parsedQuery = SetStageQuerySchema.safeParse(req.query);

    if (!parsedBody.success || !parsedQuery.success) {
      console.log(parsedBody);
      console.log(parsedQuery);
      res.status(400).end('Action data malformed');
    } else {
      const { stage } = parsedBody.data;
      const { competitionId } = parsedQuery.data;

      try {
        const competition = await setCurrentStage(
          prismaContext,
          competitionId,
          stage
        );

        await Promise.all([
          publishNewStageClient(competitionId, stage),
          publishNewStageAdmin(competitionId, stage)
        ]);
        res.status(200).json(competition);
        return;
      } catch (error) {
        console.log(error);
        res.status(500).end('Unexpected internal server error');
        return;
      }
    }
  } else {
    res.status(404).end();
  }
}
