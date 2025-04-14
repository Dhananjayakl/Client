import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
// import { ExclamationTriangleFill } from "react-bootstrap-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faTriangleExclamation,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-bootstrap";

function Confirmation(props) {
  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      style={{
        backdropFilter: "blur(5px)",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
      }}
      backdrop={false}
    >
      <Modal.Header>
        <Modal.Title>Confirmation</Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.content}</Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          onClick={() => {
            if (props.onConfirm) {
              props.onConfirm();
            }
            props.onHide();
          }}
        >
          Yes
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            if (props.onNoClick) {
              props.onNoClick();
            }
            props.onHide();
          }}
        >
          No
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
function ModalButton({
  buttonText,
  modalType,
  controlId,
  processId = null,
  content,
}) {
  const [show, setShow] = useState(false);
  const [selectedControlId, setSelectedControlId] = useState(null);

  const handleOpenModal = (content, id) => {
    setSelectedControlId(id);
    setShow(true);
  };

  const handleCloseModal = () => {
    setShow(false);
    setSelectedControlId(null);
  };

  return (
    <>
      <Button
        variant="link"
        onClick={() => handleOpenModal(modalType, controlId)}
      >
        {buttonText}
      </Button>

      <Modal
        className="modal-xl setting"
        // backdrop="static"
        show={show}
        onHide={handleCloseModal}
        style={{
          backdropFilter: "blur(5px)",
          backgroundColor: "rgba(0, 0, 0, 0.3)",
        }}
        backdrop={false}
      >
        <Modal.Header>
          <FontAwesomeIcon
            icon={faTimes}
            size="xl"
            onClick={handleCloseModal}
            style={{ marginLeft: "1080px" }}
          />
        </Modal.Header>
        <Modal.Body>{content(selectedControlId)}</Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </>
  );
}

export { ModalButton };
export default Confirmation;
