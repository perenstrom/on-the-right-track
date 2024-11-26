import { Segment } from '@prisma/client';
import { Button } from 'components/Button';
import { ConnectionStatus } from 'components/ConnectionStatus';
import { Label, Input, SubmitButton } from 'components/FormControls';
import { AddTeam } from 'components/competitions/admin/AddTeam';
import { AdminTeam } from 'components/competitions/admin/AdminTeam';
import { BreadCrumb } from 'components/competitions/admin/BreadCrumb';
import { PublishButton } from 'components/competitions/admin/PublishButton';
import { StageController } from 'components/competitions/admin/StageController';
import { getShortSegmentName } from 'helpers/copy';
import { useAblyAdminChannel } from 'hooks/useAblyAdminChannel';
import { prismaContext } from 'lib/prisma';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { FormEventHandler, useCallback, useState } from 'react';
import {
  createTeam,
  setCompetitionWinner,
  setCurrentLevel,
  setCurrentStage,
  setScorePublished
} from 'services/local';
import { getCompetition } from 'services/prisma';
import styled from 'styled-components';
import { FullCompetition, FullTeam, UncreatedTeam } from 'types/types';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: hsla(0, 0%, 90%, 70%);
  z-index: 100;

  display: flex;
  justify-content: center;
  align-items: center;

  > div {
    background-color: white;
    padding: 2rem 3rem;
    border-radius: 10px;
    width: 30rem;
    height: 25rem;

    h2 {
      margin-top: 0;
    }
  }
`;

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

const ControlBar = styled.div`
  background-color: hsl(0, 0%, 85%);
  border-right: 1px solid hsl(0, 0%, 0%);
  flex: 0 0 12rem;

  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
`;

const PublishWrapper = styled.div`
  width: 100%;
  padding: 1rem;
`;

const ModalContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const ModalContent = styled.div`
  flex-grow: 1;
`;

const ModalButtonWrapper = styled.div`
  display: flex;
  gap: 1rem;
`;

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

  const { connectionState } = useAblyAdminChannel(
    competition.id,
    useCallback(
      (msg) => {
        console.log('message received');
        console.log(JSON.stringify(msg, null, 2));
        return router.replace(router.asPath);
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

  const [addingTeam, setAddingTeam] = useState(false);
  const [name, setName] = useState(`Lag ${competition.teams.length + 1}`);
  const [members, setMembers] = useState('');
  const [displayAnswers, setDisplayAnswers] = useState(false);

  const currentSegment =
    competition.currentStage &&
    competition.currentStage !== competition.segments.length + 1
      ? competition.segments[competition.currentStage - 1]
      : null;

  const handleAddTeam: FormEventHandler = async (event) => {
    event.preventDefault();
    const newTeam: UncreatedTeam = {
      name,
      members,
      competitionId: competition.id
    };

    await createTeam(newTeam);
    setAddingTeam(false);
    router.replace(router.asPath);
  };

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
      ? getShortSegmentName(competition.segments[competition.currentStage - 2])
      : undefined;

  const nextStage = !competition.currentStage
    ? getShortSegmentName(competition.segments[0])
    : competition.currentStage < competition.segments.length
    ? getShortSegmentName(competition.segments[competition.currentStage])
    : competition.currentStage === competition.segments.length
    ? 'end'
    : undefined;

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

    await setCurrentLevel(competition.id, nextLevel);
    router.replace(router.asPath);
  };

  const previousLevel =
    competition.currentLevel === 10
      ? 'N/A'
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

  const [endGameModalOpen, setEndGameModalOpen] = useState(false);
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
      setEndGameModalOpen(false);
    } else {
      await setCompetitionWinner(competition.id, null);
    }

    setEndGameModalOpen(false);
    router.replace(router.asPath);
  };

  return (
    <>
      {addingTeam && (
        <ModalOverlay>
          <div>
            <h2>Lägg till lag</h2>
            <form onSubmit={handleAddTeam}>
              <Label htmlFor="name">Namn</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
              <Label htmlFor="members">Medlemmar (ej obligatoriskt)</Label>
              <Input
                type="text"
                id="members"
                name="members"
                value={members}
                onChange={(event) => setMembers(event.target.value)}
              />
              <SubmitButton type="submit">Spara</SubmitButton>
            </form>
          </div>
        </ModalOverlay>
      )}
      {endGameModalOpen && (
        <ModalOverlay>
          <ModalContentWrapper>
            <h2>{gameIsOver ? 'Öppna' : 'Avsluta'}</h2>
            <ModalContent>
              {gameIsOver
                ? 'Är du säker på att du vill återöppna spelet och ta bort vinnare?'
                : 'Är du säker på att du vill avsluta spelet och utse vinnare?'}
            </ModalContent>
            <ModalButtonWrapper>
              <Button onClick={() => setEndGameModalOpen(false)}>
                Nej, avbryt
              </Button>
              <SubmitButton onClick={handleEndGame}>
                {gameIsOver ? 'Ja, öppna' : 'Ja, avsluta'}
              </SubmitButton>
            </ModalButtonWrapper>
          </ModalContentWrapper>
        </ModalOverlay>
      )}
      <Wrapper>
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
        <Bottom>
          <ControlBar>
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
                  {currentSegment?.scorePublished ? 'Avpublicera' : 'Publicera'}
                </PublishButton>
              </PublishWrapper>
            )}
            {isLastStage && allPublished && (
              <PublishWrapper>
                <PublishButton
                  variant={'active'}
                  onClick={() => setEndGameModalOpen(true)}
                  disabled={connectionState !== 'connected'}
                >
                  {gameIsOver ? 'Öppna' : 'Avsluta'}
                </PublishButton>
              </PublishWrapper>
            )}
            {currentSegment?.type === 'TRIP' && !gameIsOver && (
              <StageController
                heading="Nivå"
                previous={() => handleChangeLevel('prev')}
                next={() => handleChangeLevel('next')}
                currentStage={competition.currentLevel?.toString() || 'N/A'}
                previousStage={previousLevel}
                nextStage={nextLevel}
                connectionState={connectionStatus}
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
          </ControlBar>
          <Main>
            {competition.teams.map((team) => (
              <AdminTeam
                key={team.id}
                team={team}
                currentSegment={currentSegment}
                score={calculateScore(team, competition.segments)}
                connectionState={connectionStatus}
                displayAnswers={displayAnswers}
              />
            ))}
            {!gameIsOver && (
              <AddTeam
                triggerAdd={() => setAddingTeam(true)}
                connectionState={connectionStatus}
              />
            )}
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

  const competition = await getCompetition(
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
