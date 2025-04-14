import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Button, Offcanvas } from "react-bootstrap";
import {
  faEdit,
  faTrash,
  faPlus,
  faHome,
  faCircle,
} from "@fortawesome/free-solid-svg-icons";

function MyOffCanvas({ component, title }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <div className="ms-auto text-end">
        <Button variant="primary" onClick={handleShow}>
          <span>
            <FontAwesomeIcon icon={faPlus} />
          </span>{" "}
          Add {title}
        </Button>
        <Offcanvas
          show={show}
          onHide={handleClose}
          placement="end"
          backdrop="static"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Add {title}</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>{component}</Offcanvas.Body>
        </Offcanvas>
      </div>
    </>
  );
}

export default MyOffCanvas;
