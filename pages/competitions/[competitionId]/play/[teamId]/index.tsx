import { Segment, SegmentTeamState, Team } from '@prisma/client';
import { prismaContext } from 'lib/prisma';
import { GetServerSideProps, NextPage } from 'next';
import { ParsedUrlQuery } from 'querystring';
import {
  getBaseCompetition,
  getSegment,
  getTeam,
  upsertSegmentTeamState
} from 'services/prisma';
import { Competition } from 'types/types';

interface Props {
  competition: Competition;
  team: Team;
  segment: Segment | null;
  teamState: SegmentTeamState | null;
}

const CompetitionPlayPage: NextPage<Props> = ({
  competition,
  team,
  segment,
  teamState
}) => {
  return (
    <div>
      <pre>{JSON.stringify(competition, null, 2)}</pre>
      <pre>{JSON.stringify(team, null, 2)}</pre>
      <pre>{JSON.stringify(segment, null, 2)}</pre>
      <pre>{JSON.stringify(teamState, null, 2)}</pre>
    </div>
  );
};

interface Params extends ParsedUrlQuery {
  competitionId: string;
  teamId: string;
}
export const getServerSideProps: GetServerSideProps<Props, Params> = async (
  context
) => {
  if (!context?.params?.competitionId || !context?.params?.teamId) {
    throw new Error('No competition ID or team ID in params');
  }

  const [competition, team] = await Promise.all([
    getBaseCompetition(prismaContext, context?.params?.competitionId),
    getTeam(prismaContext, context?.params?.teamId)
  ]);

  const segment = competition.currentStage
    ? await getSegment(prismaContext, competition.id, competition.currentStage)
    : null;

  const teamState = segment
    ? await upsertSegmentTeamState(
        prismaContext,
        {
          segmentId: segment.id,
          teamId: team.id
        },
        {}
      )
    : null;

  return {
    props: {
      competition,
      team,
      segment,
      teamState
    }
  };
};

export default CompetitionPlayPage;
