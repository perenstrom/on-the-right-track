import { NextApiRequest, NextApiResponse } from 'next';
import { prismaContext } from 'lib/prisma';
import { setCurrentLevel } from 'services/prisma';
import { CompetitionIdSchema, SetLevelSchema } from 'schemas/zod/schema';
import { publishNewLevel as publishNewLevelClient } from 'services/ably/client';
import { publishNewLevel as publishNewLevelAdmin } from 'services/ably/admin';

const setLevel = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const parsedBody = SetLevelSchema.safeParse(req.body);
    const parsedQuery = CompetitionIdSchema.safeParse(req.query);

    if (!parsedBody.success || !parsedQuery.success) {
      console.log(parsedBody);
      console.log(parsedQuery);
      res.status(400).end('Action data malformed');
      return;
    } else {
      const { level } = parsedBody.data;
      const { competitionId } = parsedQuery.data;

      try {
        const competition = await setCurrentLevel(
          prismaContext,
          competitionId,
          level
        );

        await Promise.all([
          publishNewLevelClient(competitionId, level),
          publishNewLevelAdmin(competitionId, level)
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
};

export default setLevel;
