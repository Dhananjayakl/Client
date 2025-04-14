import { createContext, useState, useContext } from "react";
import NotificationModal from "../Utils/NotificationModal";

export const ModalContext = createContext();

export const ModalContextProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");

  const openModal = (message) => {
    setMessage(message);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setMessage("");
    setTitle("");
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <NotificationModal
        show={isOpen}
        onClose={closeModal}
        title="Action Required"
        message={message}
      />
    </ModalContext.Provider>
  );
};

export const useModalContext = () => {
  return useContext(ModalContext);
};
