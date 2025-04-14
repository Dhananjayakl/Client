import React from "react";
import { Modal, Button } from "react-bootstrap";

function NotificationModal({ show, onClose, title, message }) {
  return (
    <Modal
      show={show}
      onHide={onClose}
      backdrop="static"
      centered
      className="border-0 shadow"
    >
      <Modal.Header className="border-0 bg-info bg-opacity-50 text-warning-emphasis">
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="fw-medium bg-body-tertiary text-dark p-4">
        {message}
      </Modal.Body>
      <Modal.Footer className="border-0 bg-body-tertiary d-flex justify-content-end">
        <Button variant="secondary" onClick={onClose} className="px-4">
          Ok
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default NotificationModal;
