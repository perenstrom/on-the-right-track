import { NextApiRequest, NextApiResponse } from 'next';
import { prismaContext } from 'lib/prisma';
import { setScorePublished } from 'services/prisma';
import { PublishScoreSchema, SegmentIdSchema } from 'schemas/zod/schema';

const publishScores = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    return new Promise((resolve) => {
      const parsedBody = PublishScoreSchema.safeParse(req.body);
      const parsedQuery = SegmentIdSchema.safeParse(req.query);

      if (!parsedBody.success || !parsedQuery.success) {
        console.log(parsedBody);
        console.log(parsedQuery);
        res.status(400).end('Action data malformed');
        resolve('');
      } else {
        const { scorePublished } = parsedBody.data;
        const { segmentId } = parsedQuery.data;

        setScorePublished(prismaContext, segmentId, scorePublished)
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

export default publishScores;
