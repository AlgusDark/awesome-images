import { ChakraProvider, Box } from "@chakra-ui/core";
import { QueryCache, ReactQueryCacheProvider } from "react-query";
import type { AppProps } from "next/app";
import Head from "next/head";

import { Header } from "components/header";
import { init } from "db";

let queryCache = new QueryCache();

function Providers({ children }: { children: React.ReactNode }) {
  if (typeof window !== "undefined") {
    init();
  }

  return (
    <ReactQueryCacheProvider queryCache={queryCache}>
      <ChakraProvider resetCSS>{children}</ChakraProvider>
    </ReactQueryCacheProvider>
  );
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Providers>
      <Head>
        <title>Awesome Images</title>
      </Head>
      <Header />
      <Box px={8}>
        <Box maxWidth="1240px" margin="0 auto">
          <Component {...pageProps} />
        </Box>
      </Box>
    </Providers>
  );
}

export default MyApp;
