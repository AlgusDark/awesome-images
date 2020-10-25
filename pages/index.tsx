import { useEffect, useState } from "react";
import { Box, Button, Flex, HStack, Spinner, VStack } from "@chakra-ui/core";

import { ImagesGrid } from "components/image";
import { useSearchPhotosPaginatedQuery } from "api";

export default function Home() {
  let [query, updateQuery] = useState("");

  return (
    <Flex flexDirection="column">
      <SearchBox
        onChange={(e) => {
          updateQuery(e.currentTarget.value);
        }}
      />
      {query.length > 0 && <ImagesResults query={query} />}
    </Flex>
  );
}

type ImagesResultsProps = {
  query: string;
};
function ImagesResults({ query }: ImagesResultsProps) {
  let [page, updatePage] = useState(1);
  let {
    isLoading,
    error,
    resolvedData,
    latestData,
    isFetching,
  } = useSearchPhotosPaginatedQuery({ query, page });

  // Reset page when there is a new query
  useEffect(() => {
    updatePage(1);
  }, [query]);

  let hasMore = page < latestData?.total_pages;

  return (
    <>
      <VStack>
        <HStack>
          <Button
            onClick={() => updatePage((old) => Math.max(old - 1, 0))}
            disabled={page === 1}
          >
            Previous Page
          </Button>
          <span>Current Page: {page}</span>
          <Button
            onClick={() =>
              updatePage((old) => (!latestData || !hasMore ? old : old + 1))
            }
            disabled={!latestData || !hasMore}
          >
            Next Page
          </Button>
        </HStack>
        <Box width="100%">
          {isLoading ? (
            <Box textAlign="center">Loading Images...</Box>
          ) : error && !isFetching ? (
            <Box textAlign="center">Error: Rate Limit Exceeded 😭</Box>
          ) : resolvedData.results.length > 0 ? (
            <ImagesGrid images={resolvedData.results} />
          ) : (
            <Box textAlign="center">No results 😔</Box>
          )}
        </Box>
        {isFetching ? (
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        ) : null}
      </VStack>
    </>
  );
}

type SearchBoxProps = {
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};
function SearchBox({ onChange }: SearchBoxProps) {
  return (
    <Box
      onChange={onChange}
      as="input"
      type="search"
      placeholder="Start typing a cool word..."
      width="100%"
      paddingX={6}
      height={24}
      fontSize={32}
      outline="2px solid #2f2f2f"
      marginBottom={12}
    />
  );
}
