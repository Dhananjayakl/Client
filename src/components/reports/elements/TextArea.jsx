import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const TextArea = ({ value, row, columnMeta }) => {
  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const renderValue = () => {
    if (value && value.length > 255) {
      return (
        <>
          {value.substring(0, 255)}...
          <span
            className="text-primary text-decoration-underline cursor-pointer"
            onClick={handleShow}
          >
            More
          </span>
        </>
      );
    }
    return value;
  };

  return (
    <div>
      {renderValue()}
      <Modal show={showModal} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{columnMeta?.column_title}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: "500px", overflowY: "auto" }}>
          {value}
        </Modal.Body>
        <Modal.Footer>
          {/* <Button variant="secondary" onClick={handleClose}>
            Close
          </Button> */}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TextArea;
