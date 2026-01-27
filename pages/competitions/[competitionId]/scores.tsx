import { Segment } from '@prisma/client';
import { ConnectionStatus } from 'components/ConnectionStatus';
import { ScoreTeam } from 'components/competitions/ScoreTeam';
import ConfettiRain from 'components/competitions/ConfettiRain';
import { useAblyClientChannel } from 'hooks/useAblyClientChannel';
import { prismaContext } from 'lib/prisma';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getScoreCompetition } from 'services/prisma';
import { ScoreCompetition, ScoreTeam as ScoreTeamType } from 'types/types';
import { ablyEvents } from 'services/ably/ably';

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
    useCallback(
      (message) => {
        // Competition was deleted, redirect to home
        if (message.name === ablyEvents.deletedCompetition) {
          router.push('/');
          return;
        }

        router.replace(router.asPath);
      },
      [router]
    )
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

  const winnerTeamId = competition.winnerTeamId;
  const winnerCardRef = useRef<HTMLDivElement>(null);
  const [winnerElement, setWinnerElement] = useState<HTMLElement | null>(null);

  // Update winner element reference when winner changes
  useEffect(() => {
    if (winnerCardRef.current) {
      setWinnerElement(winnerCardRef.current);
    }
  }, [winnerTeamId]);

  return (
    <>
      <div className="flex h-full flex-col">
        <ConnectionStatus state={connectionStatus} />
        <div className="relative flex flex-1">
          <ConfettiRain
            isActive={!!winnerTeamId}
            sourceElement={winnerElement}
          />
          <div className="relative z-10 grid flex-1 grid-cols-[repeat(3,1fr)] grid-rows-[repeat(3,1fr)] gap-4 p-4">
            {competition.teams.map((team) => {
              const isWinner = competition.winnerTeamId === team.id;
              return (
                <ScoreTeam
                  key={team.id}
                  ref={isWinner ? winnerCardRef : null}
                  team={team}
                  currentSegment={currentSegment}
                  score={calculateScore(team, competition.segments)}
                  isWinner={isWinner}
                />
              );
            })}
          </div>
        </div>
      </div>
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

  try {
    const competition = await getScoreCompetition(
      prismaContext,
      context?.params?.competitionId
    );

    return {
      props: {
        competition
      }
    };
  } catch (error) {
    // Competition was deleted or not found
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    };
  }
};

export default AdminPage;
