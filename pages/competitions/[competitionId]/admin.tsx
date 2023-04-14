import { Segment } from '@prisma/client';
import { Label, Input, SubmitButton } from 'components/FormControls';
import { AddTeam } from 'components/competitions/admin/AddTeam';
import { AdminTeam } from 'components/competitions/admin/AdminTeam';
import { StageController } from 'components/competitions/admin/StageController';
import { prismaContext } from 'lib/prisma';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { FormEventHandler, useState } from 'react';
import { createTeam, setCurrentStage } from 'services/local';
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

const BreadCrumb = styled.div`
  background-color: tomato;
  flex: 0 0 3rem;
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
  flex: 0 0 12rem;

  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
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

  const [addingTeam, setAddingTeam] = useState(false);
  const [name, setName] = useState(`Lag ${competition.teams.length + 1}`);
  const [members, setMembers] = useState('');

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

    if (nextIndex >= competition.segments.length) {
      return;
    }

    if (nextIndex < 1) {
      nextIndex = null;
    }

    await setCurrentStage(competition.id, nextIndex);
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
        <BreadCrumb>breadcrumb</BreadCrumb>
        <Bottom>
          <ControlBar>
            <div>Publicera</div>
            <div>resepoäng</div>
            <StageController
              previous={() => handleChangeState('prev')}
              next={() => handleChangeState('next')}
              currentStage="2"
              previousStage="1"
              nextStage="3"
            />
          </ControlBar>
          <Main>
            {competition.teams.map((team) => (
              <AdminTeam
                key={team.id}
                team={team}
                score={calculateScore(team, competition.segments)}
              />
            ))}
            <AddTeam triggerAdd={() => setAddingTeam(true)} />
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
