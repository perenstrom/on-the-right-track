import { NextApiRequest, NextApiResponse } from 'next';
import { prismaContext } from 'lib/prisma';
import { getBaseCompetition, updateSegmentTeamState } from 'services/prisma';
import {
  CompetitionIdSchema,
  SegmentTeamStateIdSchema
} from 'schemas/zod/schema';
import { publishNewSegmentTeamState as publishNewSegmentTeamStateAdmin } from 'services/ably/admin';
import { publishNewSegmentTeamState as publishNewSegmentTeamStateClient } from 'services/ably/client';

const pullTheBreak = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const parsedBody = CompetitionIdSchema.safeParse(req.body);
    const parsedQuery = SegmentTeamStateIdSchema.safeParse(req.query);

    if (!parsedBody.success || !parsedQuery.success) {
      console.log(parsedBody);
      console.log(parsedQuery);
      res.status(400).end('Action data malformed');
    } else {
      const { competitionId } = parsedBody.data;
      const { segmentTeamStateId } = parsedQuery.data;

      try {
        const competition = await getBaseCompetition(
          prismaContext,
          competitionId
        );

        const segmentTeamState = await updateSegmentTeamState(
          prismaContext,
          segmentTeamStateId,
          {
            state: 'STOPPED',
            stopLevel: competition.currentLevel
          }
        );

        await Promise.all([
          publishNewSegmentTeamStateAdmin(competitionId, segmentTeamState),
          publishNewSegmentTeamStateClient(competitionId, segmentTeamState)
        ]);
        res.status(200).json(segmentTeamState);
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

export default pullTheBreak;
