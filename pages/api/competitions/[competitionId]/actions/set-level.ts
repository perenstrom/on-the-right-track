import { NextApiRequest, NextApiResponse } from 'next';
import { prismaContext } from 'lib/prisma';
import { setCurrentLevel } from 'services/prisma';
import { SetLevelQuerySchema, SetLevelSchema } from 'schemas/zod/schema';

const setLevel = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    return new Promise((resolve) => {
      const parsedBody = SetLevelSchema.safeParse(req.body);
      const parsedQuery = SetLevelQuerySchema.safeParse(req.query);

      if (!parsedBody.success || !parsedQuery.success) {
        console.log(parsedBody);
        console.log(parsedQuery);
        res.status(400).end('Action data malformed');
        resolve('');
      } else {
        const { level } = parsedBody.data;
        const { competitionId } = parsedQuery.data;

        setCurrentLevel(prismaContext, competitionId, level)
          .then((competition) => {
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
