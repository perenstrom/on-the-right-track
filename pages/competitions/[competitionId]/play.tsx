import { prismaContext } from 'lib/prisma';
import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { ParsedUrlQuery } from 'querystring';
import { getCompetition } from 'services/prisma';
import { FullCompetition } from 'types/types';

interface Props {
  competition: FullCompetition;
}

const CompetitionPlayChooseTeamPage: NextPage<Props> = ({ competition }) => {
  return (
    <div className="p-4">
      <h1 className="text-center">Välj lag</h1>
      {competition.teams.map((team) => (
        <Link
          className="mb-4 block cursor-pointer rounded-lg border border-[hsl(0,0%,10%)] bg-[hsl(0,0%,90%)] p-4 no-underline"
          key={team.id}
          href={`/competitions/${competition.id}/play/${team.id}/settings`}
        >
          <h2 className="mt-0 mb-0 -ml-[0.2rem]">{team.name}</h2>
          <p className="m-0">{team.members}</p>
        </Link>
      ))}
    </div>
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
