import { GetServerSideProps, NextPage } from 'next';
import { Wrapper } from 'components/Wrapper';
import { prismaContext } from 'lib/prisma';
import { getCompetitions } from 'services/prisma';
import { Competition } from 'types/types';

interface Props {
  competitions: Competition[];
}

const IndexPage: NextPage<Props> = ({ competitions }) => {
  return (
    <Wrapper>
      <h1>Den Riktiga Finalen</h1>
      <h2>Tävlingar</h2>
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
