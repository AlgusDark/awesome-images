import {
  Modal as ChakraModal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/core";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  isCentered?: boolean;
  title: React.ReactChild;
  body: React.ReactChild;
  footer?: React.ReactChild;
};

export function Modal(props: Props) {
  return (
    <ChakraModal
      isCentered={props.isCentered}
      isOpen={props.isOpen}
      onClose={props.onClose}
    >
      <ModalOverlay>
        <ModalContent>
          <ModalHeader textTransform="capitalize">{props.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{props.body}</ModalBody>
          {props.footer && (
            <ModalFooter backgroundColor="#f9fafb">{props.footer}</ModalFooter>
          )}
        </ModalContent>
      </ModalOverlay>
    </ChakraModal>
  );
}
