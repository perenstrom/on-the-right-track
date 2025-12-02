import { NextApiRequest, NextApiResponse } from 'next';
import { prismaContext } from 'lib/prisma';
import { setScorePublished } from 'services/prisma';
import { PublishScoreSchema, SegmentIdSchema } from 'schemas/zod/schema';
import { publishNewScoresPublished } from 'services/ably/client';

const publishScores = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const parsedBody = PublishScoreSchema.safeParse(req.body);
    const parsedQuery = SegmentIdSchema.safeParse(req.query);

    if (!parsedBody.success || !parsedQuery.success) {
      console.log(parsedBody);
      console.log(parsedQuery);
      res.status(400).end('Action data malformed');
      return;
    } else {
      const { scorePublished } = parsedBody.data;
      const { segmentId } = parsedQuery.data;

      try {
        const segment = await setScorePublished(
          prismaContext,
          segmentId,
          scorePublished
        );

        await publishNewScoresPublished(segment.competitionId, scorePublished);
        res.status(200).json(segment);
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

export default publishScores;
