import { GetServerSideProps, NextPage } from 'next';
import { Wrapper } from 'components/Wrapper';
import { prismaContext } from 'lib/prisma';
import { getCompetitions } from 'services/prisma';
import { Competition } from 'types/types';
import styled from 'styled-components';

const Quote = styled.blockquote`
  text-align: right;
  font-style: italic;
  font-size: 0.75rem;
  color: hsl(0 0% 50%);
`;

interface Props {
  competitions: Competition[];
}

const IndexPage: NextPage<Props> = ({ competitions }) => {
  return (
    <Wrapper>
      <h1>Den Riktiga Finalen</h1>
      <h2>Tävlingar</h2>
      <p>
        <b>Den Riktiga Finalen</b> är en av de mest prestigefyllda och
        eftertraktade tävlingarna i sitt slag. Deltagarna kämpar i flera
        omgångar, där varje moment och fråga är avgörande. Att vinna{' '}
        <b>Den Riktiga Finalen</b> innebär inte bara en känsla av personlig
        stolthet, utan också äran att bära titeln som mästare under ett helt år.
        Det är en hedersbetygelse som de flesta deltagare strävar efter och som
        bevisar att de är bland de mest kunniga och skickliga i världen.
      </p>
      <Quote>– ChatGPT, 2023</Quote>
      {competitions.length > 0 ? (
        <ul>
          {competitions.map((competition) => (
            <li key={competition.id}>
              <a href={`/competitions/${competition.id}/play`}>
                {competition.name} - {competition.hosts}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>
          <i>Det finns inga tävlingar just nu.</i>
        </p>
      )}
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
