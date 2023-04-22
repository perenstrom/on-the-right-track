import { NextApiRequest, NextApiResponse } from 'next';
import { prismaContext } from 'lib/prisma';
import {
  updateSegmentTeamState,
} from 'services/prisma';
import {
  PatchTeamSegmentQuerySchema,
  PatchTeamSegmentStateSchema
} from 'schemas/zod/schema';

const segmentTeamStates = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'PATCH') {
    return new Promise((resolve) => {
      const parsedBody = PatchTeamSegmentStateSchema.safeParse(req.body);
      const parsedQuery = PatchTeamSegmentQuerySchema.safeParse(req.query);
      if (!parsedBody.success) {
        console.log(parsedBody.error);
      }
      if (!parsedBody.success || !parsedQuery.success) {
        console.log(parsedBody);
        console.log(parsedQuery);
        res.status(400).end('Segment team state data malformed');
        resolve('');
      } else {
        updateSegmentTeamState(
          prismaContext,
          parsedQuery.data.segmentTeamStateId,
          parsedBody.data
        )
          .then((team) => {
            res.status(200).json(team);
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

export default segmentTeamStates;
