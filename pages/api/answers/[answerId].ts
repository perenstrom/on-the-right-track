import { NextApiRequest, NextApiResponse } from 'next';
import { prismaContext } from 'lib/prisma';
import { updateAnswer } from 'services/prisma';
import { PatchAnswerQuerySchema, PatchAnswerSchema } from 'schemas/zod/schema';

const answers = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'PATCH') {
    const parsedBody = PatchAnswerSchema.safeParse(req.body);
    const parsedQuery = PatchAnswerQuerySchema.safeParse(req.query);

    if (!parsedBody.success) {
      console.log(parsedBody.error);
    }

    if (!parsedBody.success || !parsedQuery.success) {
      console.log(parsedBody);
      console.log(parsedQuery);
      res.status(400).end('Answer state data malformed');
      return;
    } else {
      try {
        const answer = await updateAnswer(
          prismaContext,
          parsedQuery.data.answerId,
          parsedBody.data
        );

        res.status(200).json(answer);
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

export default answers;
