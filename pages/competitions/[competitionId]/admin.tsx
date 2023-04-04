import { AddTeam } from 'components/competitions/admin/AddTeam';
import { prismaContext } from 'lib/prisma';
import { GetServerSideProps, NextPage } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { getCompetition } from 'services/prisma';
import styled from 'styled-components';
import { Competition } from 'types/types';

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
  competition: Competition;
}

const AdminPage: NextPage<Props> = ({ competition }) => {
  return (
    <Wrapper>
      <BreadCrumb>breadcrumb</BreadCrumb>
      <Bottom>
        <ControlBar>
          <div>Publicera</div>
          <div>resepoäng</div>
          <div>moment</div>
        </ControlBar>
        <Main>
          <div>team</div>
          <div>team</div>
          <div>team</div>
          <div>team</div>
          <div>team</div>
          <div>team</div>
          <div>team</div>
          <div>team</div>
          <AddTeam triggerAdd={() => console.log('Add')} />
        </Main>
      </Bottom>
      {false && <pre>{JSON.stringify(competition, null, 2)}</pre>}
    </Wrapper>
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
