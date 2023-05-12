import { Segment } from '@prisma/client';
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

  const [addingTeam, setAddingTeam] = useState(false);
  const [name, setName] = useState(`Lag ${competition.teams.length + 1}`);
  const [members, setMembers] = useState('');

  const currentSegment = competition.currentStage
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

  const handleChangeState = async (direction: 'next' | 'prev') => {
    let nextIndex: number | null =
      direction === 'next'
        ? (competition.currentStage || 0) + 1
        : (competition.currentStage || 0) - 1;

    if (nextIndex > competition.segments.length) {
      return;
    }

    if (nextIndex < 1) {
      nextIndex = null;
    }

    await setCurrentStage(competition.id, nextIndex);
    router.replace(router.asPath);
  };

  const previousStage =
    competition.currentStage === 1
      ? 'N/A'
      : competition.currentStage && competition.currentStage > 1
      ? getShortSegmentName(competition.segments[competition.currentStage - 2])
      : undefined;

  const nextStage = !competition.currentStage
    ? getShortSegmentName(competition.segments[0])
    : competition.currentStage < competition.segments.length
    ? getShortSegmentName(competition.segments[competition.currentStage])
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

  const handlePublish = async () => {
    if (!currentSegment) {
      return;
    }

    await setScorePublished(currentSegment.id, !currentSegment.scorePublished);
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
      <Wrapper>
        <ConnectionStatus state={connectionStatus} />
        <BreadCrumb
          segments={competition.segments}
          currentSegment={currentSegment?.id || ''}
        />
        <Bottom>
          <ControlBar>
            {someOneAnswered && (
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
            {currentSegment?.type === 'TRIP' && (
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
            <StageController
              heading="Moment"
              previous={() => handleChangeState('prev')}
              next={() => handleChangeState('next')}
              currentStage={
                competition.currentStage
                  ? getShortSegmentName(
                      competition.segments[competition.currentStage - 1]
                    )
                  : 'N/A'
              }
              previousStage={previousStage}
              nextStage={nextStage}
              connectionState={connectionStatus}
            />
          </ControlBar>
          <Main>
            {competition.teams.map((team) => (
              <AdminTeam
                key={team.id}
                team={team}
                currentSegment={currentSegment}
                score={calculateScore(team, competition.segments)}
                connectionState={connectionStatus}
              />
            ))}
            <AddTeam
              triggerAdd={() => setAddingTeam(true)}
              connectionState={connectionStatus}
            />
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
