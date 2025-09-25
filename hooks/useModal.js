import React, { useState, useCallback } from "react";
import Modal from "../components/Modal";

const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalProps, setModalProps] = useState({});

  const handleOpen = useCallback((content, props = {}) => {
    setModalContent(content);
    setModalProps(props);
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setModalContent(null);
    setModalProps({});
  }, []);

  const renderModal = useCallback(() => {
    if (!isOpen) return null;

    return (
      <Modal isOpen={isOpen} onClose={handleClose} {...modalProps}>
        {modalContent}
      </Modal>
    );
  }, [isOpen, handleClose, modalContent, modalProps]);

  return {
    renderModal,
    handleOpen,
    handleClose,
  };
};

export default useModal;
