import { Team } from '@prisma/client';
import { Button } from 'components/Button';
import { Input, Label } from 'components/FormControls';
import { prismaContext } from 'lib/prisma';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { useState } from 'react';
import { updateTeam } from 'services/local';
import { getTeam } from 'services/prisma';
import { z } from 'zod';

interface Props {
  team: Team;
}

const Params = z.object({
  competitionId: z.string(),
  teamId: z.string()
});

const CompetitionPlaySetTeamSettingsPage: NextPage<Props> = ({ team }) => {
  const router = useRouter();
  const parsedParams = Params.safeParse(router.query);

  const [name, setName] = useState(team.name);
  const [members, setMembers] = useState(team.members);

  const [loading, setLoading] = useState(false);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (!parsedParams.success) {
      return;
    }

    const { competitionId } = parsedParams.data;

    await updateTeam(team.id, { competitionId, name, members });

    router.push(`/competitions/${competitionId}/play/${team.id}`);

    setLoading(false);
  };

  return (
    <form className="p-4" onSubmit={handleSubmit}>
      <h1 className="text-center">Ändra inställningar</h1>
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
      <Button
        className="border border-[hsl(116,46%,30%)] bg-[hsl(116,46%,55%)]"
        type="submit"
        disabled={loading}
      >
        Börja spela
      </Button>
    </form>
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

export default CompetitionPlaySetTeamSettingsPage;
