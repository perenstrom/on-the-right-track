import { GetServerSideProps, NextPage } from 'next';
import { Wrapper } from 'components/Wrapper';
import { prismaContext } from 'lib/prisma';
import { getCompetitions } from 'services/prisma';
import { Competition } from 'types/types';
import Link from 'next/link';
import { Copy } from 'lucide-react';

interface Props {
  competitions: Competition[];
}

const IndexPage: NextPage<Props> = ({ competitions }) => {
  return (
    <Wrapper>
      <h1>Den Riktiga Finalen</h1>
      <p>
        <b>Den Riktiga Finalen</b> är en av de mest prestigefyllda och
        eftertraktade tävlingarna i sitt slag. Deltagarna kämpar i flera
        omgångar, där varje moment och fråga är avgörande. Att vinna{' '}
        <b>Den Riktiga Finalen</b> innebär inte bara en känsla av personlig
        stolthet, utan också äran att bära titeln som mästare under ett helt år.
        Det är en hedersbetygelse som de flesta deltagare strävar efter och som
        bevisar att de är bland de mest kunniga och skickliga i världen.
      </p>
      <blockquote className="font-italic text-right text-xs text-[hsl(0,0%,50%)]">
        – ChatGPT, 2023
      </blockquote>

      <h2>Tävlingar</h2>
      {competitions.length > 0 ? (
        <ul>
          {competitions.map((competition) => (
            <li key={competition.id} className="flex items-center gap-2">
              <Link href={`/competitions/${competition.id}/admin`}>
                {competition.name} - {competition.hosts}
                {competition.winnerTeam && (
                  <>
                    {' '}
                    <span className="text-sm">
                      (Vinnare: {competition.winnerTeam.name} -{' '}
                      {competition.winnerTeam.members})
                    </span>
                  </>
                )}
              </Link>
              <Link
                href={`/create?clone=${competition.id}`}
                className="inline-flex items-center text-gray-500 transition-colors hover:text-gray-700"
                title="Kopiera tävling"
              >
                <Copy size={16} />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>
          <i>Det finns inga tävlingar just nu.</i>
        </p>
      )}
      <p className="mt-4">
        <Link href="/create">Skapa tävling</Link>
      </p>
    </Wrapper>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const competitions = await getCompetitions(prismaContext);

  return {
    props: {
      competitions
    }
  };
};

export default IndexPage;
