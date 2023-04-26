import { NextApiRequest, NextApiResponse } from 'next';
import { prismaContext } from 'lib/prisma';
import { updateAnswer } from 'services/prisma';
import { PatchAnswerQuerySchema, PatchAnswerSchema } from 'schemas/zod/schema';

const answers = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'PATCH') {
    return new Promise((resolve) => {
      const parsedBody = PatchAnswerSchema.safeParse(req.body);
      const parsedQuery = PatchAnswerQuerySchema.safeParse(req.query);

      if (!parsedBody.success) {
        console.log(parsedBody.error);
      }

      if (!parsedBody.success || !parsedQuery.success) {
        console.log(parsedBody);
        console.log(parsedQuery);
        res.status(400).end('Answer state data malformed');
        resolve('');
      } else {
        updateAnswer(prismaContext, parsedQuery.data.answerId, parsedBody.data)
          .then((answer) => {
            res.status(200).json(answer);
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

export default answers;
