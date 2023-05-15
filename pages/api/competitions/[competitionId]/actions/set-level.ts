import { NextApiRequest, NextApiResponse } from 'next';
import { prismaContext } from 'lib/prisma';
import { setCurrentLevel } from 'services/prisma';
import { CompetitionIdSchema, SetLevelSchema } from 'schemas/zod/schema';
import { publishNewLevel } from 'services/ably/client';

const setLevel = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    return new Promise((resolve) => {
      const parsedBody = SetLevelSchema.safeParse(req.body);
      const parsedQuery = CompetitionIdSchema.safeParse(req.query);

      if (!parsedBody.success || !parsedQuery.success) {
        console.log(parsedBody);
        console.log(parsedQuery);
        res.status(400).end('Action data malformed');
        resolve('');
      } else {
        const { level } = parsedBody.data;
        const { competitionId } = parsedQuery.data;

        console.log(`Setting level to ${level} for competition ${competitionId}`);

        setCurrentLevel(prismaContext, competitionId, level)
          .then(async (competition) => {
            console.log(`Level set to ${competition.currentLevel} for competition ${competitionId}`);
            await publishNewLevel(competitionId, level);
            console.log('Published Ably message, returning response');
            res.status(200).json(competition);
            resolve('');
          })
          .catch((error) => {
            console.log(error);
            res.status(500).end('Unexpected internal server error');
            resolve('');
          });
      }
    });
  } else {
    res.status(404).end();
  }
};

export default setLevel;
