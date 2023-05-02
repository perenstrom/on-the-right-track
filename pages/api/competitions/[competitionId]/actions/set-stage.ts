import { NextApiRequest, NextApiResponse } from 'next';
import { prismaContext } from 'lib/prisma';
import { setCurrentStage } from 'services/prisma';
import { SetStageQuerySchema, SetStageSchema } from 'schemas/zod/schema';
import { publishNewStage } from 'services/ably';

const setStage = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    return new Promise((resolve) => {
      const parsedBody = SetStageSchema.safeParse(req.body);
      const parsedQuery = SetStageQuerySchema.safeParse(req.query);

      if (!parsedBody.success || !parsedQuery.success) {
        console.log(parsedBody);
        console.log(parsedQuery);
        res.status(400).end('Action data malformed');
        resolve('');
      } else {
        const { stage } = parsedBody.data;
        const { competitionId } = parsedQuery.data;

        setCurrentStage(prismaContext, competitionId, stage)
          .then((competition) => {
            publishNewStage(competitionId, stage);
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

export default setStage;
