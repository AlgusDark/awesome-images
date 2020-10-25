import { Tag, HStack, Flex, Box, Heading } from "@chakra-ui/core";
import { useEffect, useState } from "react";

import { useListQuery, useListsQuery, usePATCHListMutation } from "api";
import { ImagesGrid } from "components/image";
import { ListForm, ListInfo } from "components/add-to-list";

type List = {
  id: string;
  title: string;
  description: string;
};

export default function MyList() {
  let [activeList, updateActiveList] = useState<List>(null);
  let [editMode, setEditMode] = useState(false);

  let listsQuery = useListsQuery();
  let listQuery = useListQuery(activeList?.id);

  let [mutate, _] = usePATCHListMutation();

  // Reset edit mode if we change to other list
  useEffect(() => {
    setEditMode(false);
  }, [activeList?.id]);

  if (listsQuery.isLoading) {
    return <span>Loading...</span>;
  }

  if (listsQuery.error) {
    return <span>Error 😔</span>;
  }

  return (
    <Flex flexDirection="column">
      <HStack justifyContent="center" marginBottom={8}>
        {listsQuery.data.map((list) => (
          <Tag
            _hover={{
              cursor: "pointer",
            }}
            onClick={() => {
              updateActiveList(list);
            }}
            key={list.id}
          >
            {list.title}
          </Tag>
        ))}
      </HStack>
      {!activeList ? (
        <Box textAlign="center">
          <Heading as="h2" size="xl">
            Select a Tag and check the images you saved ⭐
          </Heading>
        </Box>
      ) : null}
      {listQuery.isLoading ? (
        <Box textAlign="center">Loading...</Box>
      ) : listsQuery.error ? (
        <Box textAlign="center">Error 😔</Box>
      ) : listQuery.isSuccess && listQuery.data.images.length === 0 ? (
        <Box textAlign="center">
          <Heading as="h2" size="xl">
            You don't have images on this list 😱
          </Heading>
        </Box>
      ) : listQuery.isSuccess ? (
        <Flex direction="column">
          <Box width="50%" marginX="auto" marginBottom={4}>
            {editMode ? (
              <ListForm
                list={activeList}
                onCancel={() => {
                  setEditMode(false);
                }}
                onSubmit={(data) => {
                  mutate(data).then(() => {
                    updateActiveList(data);
                    setEditMode(false);
                  });
                }}
              />
            ) : (
              <ListInfo list={activeList} onEdit={() => setEditMode(true)} />
            )}
          </Box>
          <ImagesGrid images={listQuery.data.images} />
        </Flex>
      ) : null}
    </Flex>
  );
}
