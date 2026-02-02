import { CompetitionLinks } from '@/components/competitions/admin/CompetitionLinks';
import { DeleteCompetitionDialog } from '@/components/competitions/admin/DeleteCompetitionDialog';
import { Segment } from '@prisma/client';
import { ConnectionStatus } from 'components/ConnectionStatus';
import { AddTeam } from 'components/competitions/admin/AddTeam';
import { AdminTeam } from 'components/competitions/admin/AdminTeam';
import { BreadCrumb } from 'components/competitions/admin/BreadCrumb';
import { EndGameDialog } from 'components/competitions/admin/EndGameDialog';
import { PublishButton } from 'components/competitions/admin/PublishButton';
import { StageController } from 'components/competitions/admin/StageController';
import { getShortSegmentName } from 'helpers/copy';
import { cn } from 'helpers/tailwindUtils';
import { useAblyAdminChannel } from 'hooks/useAblyAdminChannel';
import { prismaContext } from 'lib/prisma';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { useCallback, useState } from 'react';
import { ablyEvents } from 'services/ably/ably';
import { PublishDeletedTeamSchema } from 'services/ably/client';
import {
  setCompetitionWinner,
  setCurrentLevel,
  setCurrentStage,
  setScorePublished
} from 'services/local';
import { getCompetition } from 'services/prisma';
import { FullCompetition, FullTeam } from 'types/types';
import Link from 'next/link';

const PublishWrapper = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('w-full p-4', className)} {...props} />
);

interface Props {
  competition: FullCompetition;
}

const areScoresPublished = (segments: Segment[], segmentId: Segment['id']) => {
  const segment = segments.find((segment) => segment.id === segmentId);
  return segment ? segment.scorePublished : false;
};

const calculateScore = (team: FullTeam, segments: Segment[]) =>
  team.segmentTeamStates.reduce(
    (acc, state) =>
      acc +
      (areScoresPublished(segments, state.segmentId) ? state.score || 0 : 0),
    0
  );

const AdminPage: NextPage<Props> = ({ competition }) => {
  const router = useRouter();

  const [editingTeam, setEditingTeam] = useState<string | null>(null);

  const { connectionState } = useAblyAdminChannel(
    competition.id,
    useCallback(
      (message) => {
        if (message.name === ablyEvents.deletedTeam) {
          const parsedMessage = PublishDeletedTeamSchema.safeParse(
            message.data
          );
          if (
            parsedMessage.success &&
            parsedMessage.data.teamId === editingTeam
          ) {
            setEditingTeam(null);
          }
        }
        if (message.name === ablyEvents.deletedCompetition) {
          // Competition was deleted, redirect to home
          router.push('/');
          return;
        }
        console.log('message received');
        console.log(JSON.stringify(message, null, 2));
        return router.replace(router.asPath);
      },
      [editingTeam, router]
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

  const [displayAnswers, setDisplayAnswers] = useState(false);

  const currentSegment =
    competition.currentStage &&
    competition.currentStage !== competition.segments.length + 1
      ? competition.segments[competition.currentStage - 1]
      : null;

  const [segmentIsLoading, setSegmentIsLoading] = useState(false);
  const handleChangeState = async (direction: 'next' | 'prev') => {
    let nextIndex: number | null =
      direction === 'next'
        ? (competition.currentStage || 0) + 1
        : (competition.currentStage || 0) - 1;

    if (nextIndex > competition.segments.length + 1) {
      return;
    }

    if (nextIndex < 1) {
      nextIndex = null;
    }

    setDisplayAnswers(false);
    setSegmentIsLoading(true);
    await setCurrentStage(competition.id, nextIndex);
    setSegmentIsLoading(false);
    router.replace(router.asPath);
  };

  const goToSegment = (stage: number | null) => {
    setCurrentStage(competition.id, stage);
    router.replace(router.asPath);
  };

  const previousStage =
    competition.currentStage === 1
      ? 'start'
      : competition.currentStage && competition.currentStage > 1
        ? getShortSegmentName(
            competition.segments[competition.currentStage - 2]
          )
        : undefined;

  const nextStage = !competition.currentStage
    ? getShortSegmentName(competition.segments[0])
    : competition.currentStage < competition.segments.length
      ? getShortSegmentName(competition.segments[competition.currentStage])
      : competition.currentStage === competition.segments.length
        ? 'end'
        : undefined;

  const [levelIsLoading, setLevelIsLoading] = useState(false);
  const handleChangeLevel = async (direction: 'next' | 'prev') => {
    let nextLevel: number | null =
      direction === 'next'
        ? (competition.currentLevel || 12) - 2
        : (competition.currentLevel || 12) + 2;

    if (nextLevel < 2) {
      return;
    }

    if (nextLevel > 10) {
      nextLevel = null;
    }
    setLevelIsLoading(true);
    await setCurrentLevel(competition.id, nextLevel);
    setLevelIsLoading(false);
    router.replace(router.asPath);
  };

  const previousLevel =
    competition.currentLevel === 10
      ? 'P'
      : !competition.currentLevel
        ? undefined
        : (competition.currentLevel + 2).toString();

  const nextLevel =
    competition.currentLevel === 2
      ? undefined
      : !competition.currentLevel
        ? '10'
        : (competition.currentLevel - 2).toString();

  const isHandled = (team: FullTeam) => {
    const segmentTeamState = team.segmentTeamStates.find(
      (state) => state.segmentId === currentSegment?.id
    );

    return (
      segmentTeamState?.state === 'STOPPED_HANDLED' ||
      segmentTeamState?.state === 'ANSWERED_HANDLED'
    );
  };
  const someOneAnswered = competition.teams.some(isHandled);
  const allAnswered = competition.teams.every(isHandled);
  const isLastStage =
    competition.currentStage === competition.segments.length + 1;
  const allPublished = competition.segments.every(
    (segment) => segment.scorePublished
  );
  const gameIsOver = competition.winnerTeamId !== null;

  const handlePublish = async () => {
    if (!currentSegment) {
      return;
    }

    await setScorePublished(currentSegment.id, !currentSegment.scorePublished);
    router.replace(router.asPath);
  };

  /*   const [showLinks, setShowLinks] = useState(false);
  const handleShowLinks = () => {
    setShowLinks(!showLinks);
  }; */

  const handleEndGame = async () => {
    if (!gameIsOver) {
      const winnerTeamId = competition.teams.reduce(
        (acc, team) => {
          const score = calculateScore(team, competition.segments);
          return score > acc.score ? { id: team.id, score: score } : acc;
        },
        { id: '', score: 0 }
      ).id;

      await setCompetitionWinner(competition.id, winnerTeamId);
    } else {
      await setCompetitionWinner(competition.id, null);
    }

    router.replace(router.asPath);
  };

  return (
    <>
      <div className="flex h-full flex-col">
        <ConnectionStatus state={connectionStatus} />
        <BreadCrumb
          segments={competition.segments}
          currentSegment={
            competition.currentStage === competition.segments.length + 1
              ? 'end'
              : competition.currentStage
                ? currentSegment?.id || ''
                : 'start'
          }
          gameIsOver={gameIsOver}
          goToSegment={goToSegment}
        />
        <div className="flex flex-1">
          <div className="flex flex-[0_0_12rem] flex-col items-center justify-between border-r border-[hsl(0,0%,0%)] bg-[hsl(0,0%,85%)]">
            <div className="flex w-full flex-col gap-4 p-4">
              <CompetitionLinks competitionId={competition.id} />
              <Link href={`/competitions/${competition.id}/edit`}>
                <PublishButton variant="idle">Redigera tävling</PublishButton>
              </Link>
              {competition.currentStage === null && (
                <DeleteCompetitionDialog
                  competitionId={competition.id}
                  competitionName={competition.name}
                />
              )}
            </div>
            <div className="flex w-full flex-col gap-4">
              {currentSegment?.scorePublished && (
                <PublishWrapper>
                  <PublishButton
                    variant={'active'}
                    onClick={() => setDisplayAnswers(!displayAnswers)}
                    disabled={connectionState !== 'connected'}
                  >
                    {displayAnswers ? 'Dölj svar' : 'Visa svar'}
                  </PublishButton>
                </PublishWrapper>
              )}
              {someOneAnswered && !gameIsOver && (
                <PublishWrapper>
                  <PublishButton
                    variant={allAnswered ? 'active' : 'idle'}
                    onClick={handlePublish}
                    disabled={connectionState !== 'connected'}
                  >
                    {currentSegment?.scorePublished
                      ? 'Avpublicera'
                      : 'Publicera'}
                  </PublishButton>
                </PublishWrapper>
              )}
              {isLastStage && allPublished && (
                <EndGameDialog
                  gameIsOver={gameIsOver}
                  connectionState={connectionState}
                  onEndGame={handleEndGame}
                />
              )}
              {currentSegment?.type === 'TRIP' && !gameIsOver && (
                <StageController
                  heading="Nivå"
                  previous={() => handleChangeLevel('prev')}
                  next={() => handleChangeLevel('next')}
                  currentStage={competition.currentLevel?.toString() || 'P'}
                  previousStage={previousLevel}
                  nextStage={nextLevel}
                  connectionState={connectionStatus}
                  isLoading={levelIsLoading}
                />
              )}
              {!gameIsOver && (
                <StageController
                  heading="Moment"
                  previous={() => handleChangeState('prev')}
                  next={() => handleChangeState('next')}
                  currentStage={
                    competition.currentStage &&
                    competition.currentStage === competition.segments.length + 1
                      ? 'Slut'
                      : !competition.currentStage
                        ? 'Start'
                        : getShortSegmentName(
                            competition.segments[competition.currentStage - 1]
                          )
                  }
                  previousStage={previousStage}
                  nextStage={nextStage}
                  connectionState={connectionStatus}
                  isLoading={segmentIsLoading}
                />
              )}
            </div>
          </div>
          <div className="grid flex-1 grid-cols-[repeat(3,1fr)] grid-rows-[repeat(3,1fr)] gap-4 p-4">
            {competition.teams.map((team) => (
              <AdminTeam
                key={team.id}
                team={team}
                currentSegment={currentSegment}
                score={calculateScore(team, competition.segments)}
                connectionState={connectionStatus}
                displayAnswers={displayAnswers}
                handleEditTeam={setEditingTeam}
              />
            ))}
            {!gameIsOver && (
              <AddTeam
                competitionId={competition.id}
                connectionState={connectionStatus}
              />
            )}
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
    const competition = await getCompetition(
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
