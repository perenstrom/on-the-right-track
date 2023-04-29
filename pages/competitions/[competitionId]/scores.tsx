import { Segment } from '@prisma/client';
import { ScoreTeam } from 'components/competitions/ScoreTeam';
import { prismaContext } from 'lib/prisma';
import { GetServerSideProps, NextPage } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { getScoreCompetition } from 'services/prisma';
import styled from 'styled-components';
import { ScoreCompetition, ScoreTeam as ScoreTeamType } from 'types/types';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Bottom = styled.div`
  flex: 1;
  display: flex;
`;

const Main = styled.div`
  flex: 1;

  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 1rem;
  padding: 1rem;
`;

interface Props {
  competition: ScoreCompetition;
}

const areScoresPublished = (segments: Segment[], segmentId: Segment['id']) => {
  const segment = segments.find((segment) => segment.id === segmentId);
  return segment ? segment.scorePublished : false;
};

const calculateScore = (team: ScoreTeamType, segments: Segment[]) =>
  team.segmentTeamStates.reduce(
    (acc, state) =>
      acc +
      (areScoresPublished(segments, state.segmentId) ? state.score || 0 : 0),
    0
  );

const AdminPage: NextPage<Props> = ({ competition }) => {
  const currentSegment = competition.currentStage
    ? competition.segments[competition.currentStage - 1]
    : null;

  return (
    <>
      <Wrapper>
        <Bottom>
          <Main>
            {competition.teams.map((team) => (
              <ScoreTeam
                key={team.id}
                team={team}
                currentSegment={currentSegment}
                score={calculateScore(team, competition.segments)}
              />
            ))}
          </Main>
        </Bottom>
        {false && <pre>{JSON.stringify(competition, null, 2)}</pre>}
      </Wrapper>
    </>
  );
};

interface Params extends ParsedUrlQuery {
  competitionId: string;
}
export const getServerSideProps: GetServerSideProps<Props, Params> = async (
  context
) => {
  if (!context?.params?.competitionId) {
    throw new Error('No competition ID in params');
  }

  const competition = await getScoreCompetition(
    prismaContext,
    context?.params?.competitionId
  );

  return {
    props: {
      competition
    }
  };
};

export default AdminPage;
