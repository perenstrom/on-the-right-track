import { Segment } from '@prisma/client';
import { ConnectionStatus } from 'components/ConnectionStatus';
import { ScoreTeam } from 'components/competitions/ScoreTeam';
import { useAblyClientChannel } from 'hooks/useAblyClientChannel';
import { prismaContext } from 'lib/prisma';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { useCallback, useState } from 'react';
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
  const router = useRouter();

  const { connectionState } = useAblyClientChannel(
    competition.id,
    useCallback(() => router.replace(router.asPath), [router])
  );

  const [ablyHasDisconnected, setAblyHasDisconnected] = useState(false);
  // If Ably connection fails, mark as disconnected
  if (connectionState === 'suspended' && !ablyHasDisconnected) {
    setAblyHasDisconnected(true);
  }
  // Fetch new data if connection is restored
  if (connectionState === 'connected' && ablyHasDisconnected) {
    router.replace(router.asPath);
  }

  const [ablyHasFailed, setAblyHasFailed] = useState(false);
  // If Ably connection fails, mark as failed
  if (connectionState === 'failed' && !ablyHasFailed) {
    setAblyHasFailed(true);
  }

  const connectionStatus =
    connectionState !== 'connected'
      ? ablyHasFailed
        ? 'disconnected'
        : 'connecting'
      : 'connected';

  const currentSegment = competition.currentStage
    ? competition.segments[competition.currentStage - 1]
    : null;

  return (
    <>
      <Wrapper>
        <ConnectionStatus state={connectionStatus} />
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
