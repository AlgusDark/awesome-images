import {
  Box,
  Button,
  Icon,
  Image as ChakraImage,
  Flex,
  Grid,
  useDisclosure,
} from "@chakra-ui/core";
import { IoMdDownload } from "react-icons/io";
import type { ImageProps } from "@chakra-ui/core";

import { Modal } from "components/modal";
import styles from "./image.module.css";
import { downloadImage } from "api";
import { AddToListButton, AddToListIcon } from "components/add-to-list";
import { useState } from "react";

type Props = {
  image: AwesomeImages.Image;
} & ImageProps;

function Image({ image, ...props }: Props) {
  return (
    <ChakraImage
      src={image.urls.small}
      alt={image.alt_description}
      {...props}
    />
  );
}

function ImageTile({ image, ...props }: Props) {
  return (
    <Box className={styles.tile}>
      <Image className={styles.image} image={image} {...props} />
      <div className={styles.actions}>
        <Icon
          onClick={() => downloadImage(image)}
          aria-label="download"
          as={IoMdDownload}
          boxSize="1.5em"
          marginRight={2}
        />
        <AddToListIcon image={image} />
      </div>
      <div className={styles.details}>
        By <a href={image.user.links.html}>@{image.user.username}</a>
      </div>
    </Box>
  );
}

type ImageModalProps = {
  isOpen: boolean;
  onClose: () => void;
  image: AwesomeImages.Image;
};
export function ImageModal({ isOpen, onClose, image }: ImageModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={image.alt_description || `Photo by @${image.user.username}`}
      body={<Image image={image} />}
      footer={
        <Flex>
          <Button
            leftIcon={<IoMdDownload />}
            onClick={() => downloadImage(image)}
            mr={4}
          >
            Download
          </Button>
          <AddToListButton image={image} />
        </Flex>
      }
    ></Modal>
  );
}

type ImagesGridProps = {
  images: AwesomeImages.Image[];
};
export function ImagesGrid({ images }: ImagesGridProps) {
  let { isOpen, onOpen, onClose } = useDisclosure();
  let [activeImage, updateActiveImage] = useState<AwesomeImages.Image>();

  return (
    <>
      <Grid templateColumns="repeat(5, 0.5fr)" gridGap={2}>
        {images.map((image) => (
          <ImageTile
            onClick={() => {
              updateActiveImage(image);
              onOpen();
            }}
            image={image}
            key={image.id}
          />
        ))}
      </Grid>
      {activeImage && (
        <ImageModal isOpen={isOpen} onClose={onClose} image={activeImage} />
      )}
    </>
  );
}
