import { Team } from '@prisma/client';
import { Button } from 'components/Button';
import { Input, Label } from 'components/FormControls';
import { prismaContext } from 'lib/prisma';
import { GetServerSideProps, NextPage } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { useState } from 'react';
import { getTeam } from 'services/prisma';
import styled from 'styled-components';

const Wrapper = styled.form`
  padding: 1rem;
`;

const Heading = styled.h1`
  text-align: center;
`;

const SubmitButton = styled(Button)`
  background-color: hsl(116, 46%, 55%);
  border: 1px solid hsl(116, 46%, 30%);
`;

interface Props {
  team: Team;
}

const CompetitionPlayChooseTeamPage: NextPage<Props> = ({ team }) => {
  const [name, setName] = useState(team.name);
  const [members, setMembers] = useState(team.members);

  const [loading, setLoading] = useState(false);
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    console.log('submit');
    setLoading(false);
  };

  return (
    <Wrapper onSubmit={handleSubmit}>
      <Heading>Ändra inställningar</Heading>
      <Label htmlFor="name">Lagnamn</Label>
      <Input
        type="text"
        id="name"
        name="name"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <Label>Medlemmar</Label>
      <Input
        type="text"
        id="members"
        name="members"
        value={members}
        onChange={(event) => setMembers(event.target.value)}
      />
      <SubmitButton type="submit" disabled={loading}>
        Börja spela
      </SubmitButton>
    </Wrapper>
  );
};

interface Params extends ParsedUrlQuery {
  teamId: string;
}
export const getServerSideProps: GetServerSideProps<Props, Params> = async (
  context
) => {
  if (!context?.params?.teamId) {
    throw new Error('No team ID in params');
  }

  const team = await getTeam(prismaContext, context?.params?.teamId);

  return {
    props: {
      team
    }
  };
};

export default CompetitionPlayChooseTeamPage;
