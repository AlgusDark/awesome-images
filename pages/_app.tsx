import { ChakraProvider, Box, Flex, Link } from "@chakra-ui/core";
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

function Footer() {
  return (
    <Flex className="footer" p={8} justifyContent="center">
      You can find the code at{" "}
      <Link pl={2} href="https://github.com/AlgusDark/awesome-images">
        GitHub
      </Link>
    </Flex>
  );
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Providers>
      <Head>
        <title>Awesome Images</title>
      </Head>
      <Header />
      <Box className="content" px={8}>
        <Box maxWidth="1240px" margin="0 auto">
          <Component {...pageProps} />
        </Box>
      </Box>
      <Footer />
      <style global jsx>{`
        html,
        body,
        #__next {
          height: 100%;
        }
        #__next {
          display: flex;
          flex-direction: column;
        }
        .content {
          flex: 1 0 auto;
        }
        .footer {
          flex-shrink: 0;
        }
      `}</style>
    </Providers>
  );
}

export default MyApp;
