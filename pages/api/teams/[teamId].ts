import { NextApiRequest, NextApiResponse } from 'next';
import { prismaContext } from 'lib/prisma';
import { updateTeam } from 'services/prisma';
import { PatchTeamQuerySchema, PatchTeamSchema } from 'schemas/zod/schema';
import { publishNewTeam } from 'services/ably/admin';

const teams = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'PATCH') {
    return new Promise((resolve) => {
      const parsedBody = PatchTeamSchema.safeParse(req.body);
      const parsedQuery = PatchTeamQuerySchema.safeParse(req.query);

      if (!parsedBody.success || !parsedQuery.success) {
        console.log(parsedBody);
        console.log(parsedQuery);
        res.status(400).end('Action data malformed');
        resolve('');
      } else {
        updateTeam(prismaContext, parsedQuery.data.teamId, parsedBody.data)
          .then((team) => {
            publishNewTeam(parsedBody.data.competitionId, team);
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

export default teams;
