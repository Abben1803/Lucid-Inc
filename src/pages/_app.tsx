// Courtesy of next auth for checking sessions server side.


import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import Head from 'next/head'

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Indie+Flower&display=swap" rel="stylesheet" /> 
      </Head>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </>
  );
}

export default MyApp;