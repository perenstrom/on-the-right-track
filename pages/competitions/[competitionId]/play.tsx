import { prismaContext } from 'lib/prisma';
import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { ParsedUrlQuery } from 'querystring';
import { getCompetition } from 'services/prisma';
import styled from 'styled-components';
import { FullCompetition } from 'types/types';

const Wrapper = styled.div`
  padding: 1rem;
`;

const Heading = styled.h1`
  text-align: center;
`;

const TeamWrapper = styled(Link)`
  display: block;
  background-color: hsl(0, 0%, 90%);
  border: 1px solid hsl(0, 0%, 10%);
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
  text-decoration: none;
`;

const TeamName = styled.h2`
  margin-left: -0.2rem;
  margin-bottom: 0;
  margin-top: 0;
`;

const TeamMembers = styled.p`
  margin: 0;
`;

interface Props {
  competition: FullCompetition;
}

const CompetitionPlayChooseTeamPage: NextPage<Props> = ({ competition }) => {
  return (
    <Wrapper>
      <Heading>Välj lag</Heading>
      {competition.teams.map((team) => (
        <TeamWrapper key={team.id} href={`/competitions/${competition.id}/play/${team.id}/settings`}>
          <TeamName>{team.name}</TeamName>
          <TeamMembers>{team.members}</TeamMembers>
        </TeamWrapper>
      ))}
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

export default CompetitionPlayChooseTeamPage;
