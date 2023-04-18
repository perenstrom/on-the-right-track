import React from 'react';
import { useRouter } from 'next/router';
import { AppProps } from 'next/app';
import { createGlobalStyle } from 'styled-components';
import Head from 'next/head';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=Mulish:ital,wght@0,300;0,500;1,300;1,500&display=swap');

  // RESET
  *, *::before, *::after {
    box-sizing: border-box;
  }

  * {
    margin: 0;
  }
  
  html, body {
    height: 100%;
  }
  
  body {
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }
  
  img, picture, video, canvas, svg {
    display: block;
    max-width: 100%;
  }
  
  input, button, textarea, select {
    font: inherit;
  }
  
  p, h1, h2, h3, h4, h5, h6 {
    overflow-wrap: break-word;
  }
  
  #root, #__next {
    isolation: isolate;
    height: 100%;
  }
  // END RESET

  // GLOBAL STYLES
  body {
    font-family: 'Mulish', sans-serif;
    font-weight: 300;
    line-height: 1.75;
    color: hsl(0 0% 15%);
    background-color: hsl(60 30% 97%);
  }

  h1, h2, h3, h4, h5, h6 {
    margin: 3rem 0 1.38rem -0.4rem;
    font-family: 'Cinzel', serif;
    font-weight: 700;
    line-height: 1.3;

    @media (max-width: 768px) {
      margin: 1rem 0 1.38rem -0.4rem;
    }
  }
  
  h1 {
  margin-top: 0;
  font-size: 4.209rem;
}

  h2 { font-size: 3.157rem; }

  h3 { font-size: 2.369rem; }

  h4 { font-size: 1.777rem; }

  h5 { font-size: 1.333rem; }

  small { font-size: 0.75rem; }

  p {
    margin-bottom: 1rem;
    b {
      font-weight: 500;
    }
  }

  a {
    color: hsl(0 0% 15%);
  }

  a:hover {
    color: hsl(320 70% 35%);
  }

  @media (max-width: 768px) {
    h1 {
      margin-top: 0;
      font-size: 1.802rem;
    }

    h2 {font-size: 1.602rem;}

    h3 {font-size: 1.424rem;}

    h4 {font-size: 1.266rem;}

    h5 {font-size: 1.125rem;}

    small {font-size: 0.889rem;}
  }
`;

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
        />
        <title>Den Riktiga Finalen</title>
      </Head>
      <GlobalStyle />
      <Component {...pageProps} key={router.asPath} />
    </>
  );
}

export default MyApp;
