import React from "react";
import { Modal, Button } from "react-bootstrap";

const ISSUE_ALERT_MODAL = ({ isOpen, onClose, message }) => {
  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Header className="border-0 bg-info bg-opacity-50 text-warning-emphasis" closeButton>
        <Modal.Title>Alert</Modal.Title>
      </Modal.Header>
      <Modal.Body className="fw-medium bg-body-tertiary text-dark p-4 " style={{maxHeight:"400px",overflowY:"auto"}}>
        {typeof message === "object"?<><p>please fill the mandatory fields in the following actions </p>{Object.entries(message).map(([key, value])=>(<><h4>{value[value.length-1]}</h4>
      <ul>{value.map((notFille,index)=>(index!=value.length-1?<li>{notFille}</li>:""))}</ul></>
      ))}</>:message}
      </Modal.Body>
      <Modal.Footer  className="border-0 bg-body-tertiary d-flex justify-content-end">
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ISSUE_ALERT_MODAL;
