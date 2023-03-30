import { NextPage } from 'next';
import Head from 'next/head';
import styled from 'styled-components';

const Wrapper = styled.div`
  max-width: 700px;
  margin: 0 auto;
`;

const IndexPage: NextPage<{}> = ({}) => {
  return (
    <Wrapper>
      <Head>
        <title>NextJS Typescript Starter</title>
      </Head>
      <h1>Opinionated NextJS Typescript starter</h1>
      <p>
        This is my preferred starter template for building NextJS apps in
        Typescript.
      </p>
    </Wrapper>
  );
};

export default IndexPage;
