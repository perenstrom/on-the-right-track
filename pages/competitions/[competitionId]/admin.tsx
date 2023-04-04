import { Label, Input, SubmitButton } from 'components/FormControls';
import { AddTeam } from 'components/competitions/admin/AddTeam';
import { prismaContext } from 'lib/prisma';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { FormEventHandler, useState } from 'react';
import { createTeam } from 'services/local';
import { getCompetition } from 'services/prisma';
import styled from 'styled-components';
import { FullCompetition, UncreatedTeam } from 'types/types';

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

  div {
    border: 1px solid black;
  }
`;

const ControlBar = styled.div`
  background-color: #85ee85;
  flex: 0 0 12rem;

  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
`;

interface Props {
  competition: FullCompetition;
}

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
            <div>moment</div>
          </ControlBar>
          <Main>
            {competition.teams.map((team) => (
              <div key={team.id}>
                {team.name} - {team.members}
              </div>
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
