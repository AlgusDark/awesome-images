import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Button,
  Box,
  Select,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Icon,
  useDisclosure,
  HStack,
  useToast,
} from "@chakra-ui/core";
import { useRef, useState } from "react";
import { IoMdStarOutline } from "react-icons/io";
import { v4 as uuid } from "uuid";

import { Modal } from "components/modal";
import { useListsQuery, useSaveToListMutation } from "api";

type ListFormProps = {
  list?: { id: string; title: string; description: string };
  onSubmit: (list: ListFormProps["list"]) => void;
  onCancel: () => void;
};

export function ListForm({ list, onSubmit, onCancel }: ListFormProps) {
  let $listTitle = useRef<HTMLInputElement>(null);
  let $listDescription = useRef<HTMLInputElement>(null);

  return (
    <VStack
      as="form"
      style={{ width: "100%" }}
      onSubmit={(e) => {
        e.preventDefault();

        if ($listTitle.current.value && $listDescription.current.value) {
          onSubmit({
            id: list?.id,
            title: $listTitle.current.value,
            description: $listDescription.current.value,
          });
        }
      }}
    >
      <FormControl isRequired>
        <FormLabel>Title:</FormLabel>
        <Input
          ref={$listTitle}
          name="title"
          id="title"
          type="text"
          defaultValue={list?.title}
        />
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Description:</FormLabel>
        <Input
          ref={$listDescription}
          name="description"
          id="description"
          type="text"
          defaultValue={list?.description}
        />
      </FormControl>
      <HStack alignSelf="flex-end">
        <Button colorScheme="pink" onClick={onCancel}>
          Cancel
        </Button>
        <Button colorScheme="teal" type="submit">
          Save
        </Button>
      </HStack>
    </VStack>
  );
}

export function ListInfo({ list, onEdit }) {
  return (
    <VStack justifyContent="space-between" alignItems="flex-start">
      <Box>
        <strong>Title:</strong> {list.title}
      </Box>
      <Box>
        <strong>Description: </strong> {list.description}
      </Box>
      <Button
        alignSelf="flex-end"
        marginTop={4}
        colorScheme="teal"
        onClick={onEdit}
      >
        Edit
      </Button>
    </VStack>
  );
}

type ListProps = {
  image: AwesomeImages.Image;
  onSave?: () => void;
  onCancel?: () => void;
};

function List({ image, onSave, onCancel }: ListProps) {
  let newListId = uuid();
  let [showCreateForm, setShowCreateForm] = useState(false);
  let toast = useToast();

  let { data, status } = useListsQuery();
  let [mutate, _] = useSaveToListMutation();

  return (
    <VStack>
      <Select
        marginBottom={4}
        onChange={(e) => {
          let currentTarget = e.currentTarget;
          if (currentTarget.value === newListId) {
            setShowCreateForm(true);
          } else {
            setShowCreateForm(false);
            if (currentTarget.value) {
              let { selectedIndex } = currentTarget;

              mutate({
                id: currentTarget.children[selectedIndex].id,
                image,
              }).then(() => {
                toast({
                  title: "Image saved in list",
                  description: `${currentTarget.value} has a new image`,
                  status: "success",
                  duration: 5000,
                  isClosable: true,
                });
                if (onSave) onSave();
              });
            }
          }
        }}
        placeholder="Select a list"
      >
        <option value={newListId}>Create a new list</option>
        {status === "success" &&
          data.map(({ id, title }) => (
            <option key={id} id={id} value={title}>
              {title}
            </option>
          ))}
      </Select>
      {showCreateForm && (
        <ListForm
          onCancel={onCancel}
          onSubmit={({ title, description }) => {
            mutate({
              title,
              description,
              image,
            }).then(() => {
              toast({
                title: `${title} has been created`,
                description: "You can start adding more images.",
                status: "success",
                duration: 5000,
                isClosable: true,
              });
              if (onSave) onSave();
            });
          }}
        />
      )}
    </VStack>
  );
}

export function AddToListButton({ image }: { image: AwesomeImages.Image }) {
  let { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <Popover
      onClose={onClose}
      onOpen={onOpen}
      isOpen={isOpen}
      placement="top-start"
    >
      <PopoverTrigger>
        <Button leftIcon={<IoMdStarOutline />}>Add to list</Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverBody>
          {isOpen && (
            <Box>
              <List onCancel={onClose} onSave={onClose} image={image} />
            </Box>
          )}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

type AddToListIconProps = {
  image: AwesomeImages.Image;
};

export function AddToListIcon({ image }: AddToListIconProps) {
  let { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <>
      <Icon
        onClick={onOpen}
        aria-label="add to list"
        as={IoMdStarOutline}
        boxSize="1.5em"
      />
      <Modal
        isCentered
        isOpen={isOpen}
        onClose={onClose}
        title="Add photo to a list"
        body={<List onCancel={onClose} onSave={onClose} image={image} />}
      />
    </>
  );
}
