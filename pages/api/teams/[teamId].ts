import { NextApiRequest, NextApiResponse } from 'next';
import { prismaContext } from 'lib/prisma';
import { deleteTeam, getTeam, updateTeam } from 'services/prisma';
import { PatchTeamQuerySchema, PatchTeamSchema } from 'schemas/zod/schema';
import {
  publishNewTeam as publishNewTeamClient,
  publishDeletedTeam as publishDeletedTeamClient
} from 'services/ably/client';
import {
  publishNewTeam as publishNewTeamAdmin,
  publishDeletedTeam as publishDeletedTeamAdmin
} from 'services/ably/admin';

const teams = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'PATCH') {
    const parsedBody = PatchTeamSchema.safeParse(req.body);
    const parsedQuery = PatchTeamQuerySchema.safeParse(req.query);

    if (!parsedBody.success || !parsedQuery.success) {
      console.log(parsedBody);
      console.log(parsedQuery);
      res.status(400).end('Action data malformed');
      return;
    } else {
      try {
        const team = await updateTeam(
          prismaContext,
          parsedQuery.data.teamId,
          parsedBody.data
        );

        await publishNewTeamClient(parsedBody.data.competitionId, team);
        await publishNewTeamAdmin(parsedBody.data.competitionId, team);
        res.status(200).json(team);
        return;
      } catch (error) {
        console.log(error);
        res.status(500).end('Unexpected internal server error');
        return;
      }
    }
  } else if (req.method === 'DELETE') {
    const parsedQuery = PatchTeamQuerySchema.safeParse(req.query);

    if (!parsedQuery.success) {
      console.log(parsedQuery);
      res.status(400).end('Action data malformed');
      return;
    } else {
      const fullTeam = await getTeam(prismaContext, parsedQuery.data.teamId);
      try {
        await deleteTeam(prismaContext, parsedQuery.data.teamId);

        await publishDeletedTeamClient(fullTeam.competitionId, fullTeam.id);
        await publishDeletedTeamAdmin(fullTeam.competitionId, fullTeam.id);
        res.status(200);
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
