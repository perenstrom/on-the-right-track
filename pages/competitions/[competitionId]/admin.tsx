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
  background-color: peachpuff;
  flex: 1;
`;

const ControlBar = styled.div`
  background-color: #85ee85;
  flex: 0 0 12rem;
`;

interface Props {
  competition: Competition;
}

const AdminPage: NextPage<Props> = ({ competition }) => {
  return (
    <Wrapper>
      <BreadCrumb>breadcrumb</BreadCrumb>
      <Bottom>
        <ControlBar>controlBar</ControlBar>
        <Main>
          <pre>{JSON.stringify(competition, null, 2)}</pre>
        </Main>
      </Bottom>
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
