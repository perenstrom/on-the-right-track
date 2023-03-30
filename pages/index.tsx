import { GetServerSideProps, NextPage } from 'next';
import styled from 'styled-components';

const Wrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
  padding-top: 6rem;

  @media (max-width: 768px) {
    margin-top: 3rem;
  }
`;

const Quote = styled.blockquote`
  text-align: right;
  font-style: italic;
  font-size: 0.75rem;
  color: hsl(0 0% 50%);
`;

const Add = styled.p`
  margin-top: 1rem;
`;

interface Props {
  competitions: string[];
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
      <Quote>– ChatGPT, 2023</Quote>

      <h2>Tävlingar</h2>
      {competitions.length > 0 ? (
        <ul>
          {competitions.map((competition) => (
            <li key={competition}>{competition}</li>
          ))}
        </ul>
      ) : (
        <p>
          <i>Det finns inga tävlingar just nu.</i>
        </p>
      )}
      <Add>
        <a href="#">Skapa tävling</a>
      </Add>
    </Wrapper>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  return {
    props: {
      competitions: ['asdf', 'qwer']
    }
  };
};

export default IndexPage;
