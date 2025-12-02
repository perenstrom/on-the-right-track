import { NextApiRequest, NextApiResponse } from 'next';
import { prismaContext } from 'lib/prisma';
import { createTeam } from 'services/prisma';
import { CreateTeamSchema } from 'schemas/zod/schema';

const teams = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const parsedTeam = CreateTeamSchema.safeParse(req.body);

    if (!parsedTeam.success) {
      console.log(JSON.stringify(parsedTeam.error, null, 2));
      res.status(400).end('Team data malformed');
      return;
    } else {
      try {
        const team = await createTeam(prismaContext, parsedTeam.data);
        res.status(200).json(team);
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

export default teams;
