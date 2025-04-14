import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button, Col, Dropdown, Row, Offcanvas } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import User from "./forms/User";

const OffcanvasBackdropSingle = ({ name, ...props }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  const toggleShow = () => setShow((s) => !s);

  return (
    <>
      <Button variant="primary" onClick={toggleShow} className="me-2">
        <FontAwesomeIcon icon={faPlus} /> {name}
      </Button>

      <Offcanvas show={show} onHide={handleClose} {...props}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{name}</Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body>
          <User />
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

const UserHeader = () => {
  let navigate = useNavigate();
  let handleClick = () => {
    // alert("Welcome"); console.log('this is:', this);
    navigate("/pages/user");
  };

  return (
    <Row className="mb-2 mb-xl-3">
      <Col xs="auto" className="d-none d-sm-block">
        <h3>USER</h3>
      </Col>

      <Col xs="auto" className="ms-auto text-end mt-n1">
        {/* <Dropdown className="d-inline me-2">
          <Dropdown.Toggle variant="light" className="bg-white shadow-sm">
            <Calendar className="feather align-middle mt-n1" /> Today
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>Action</Dropdown.Item>
            <Dropdown.Item>Another Action</Dropdown.Item>
            <Dropdown.Item>Something else here</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item>Seperated link</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown> */}

        <OffcanvasBackdropSingle placement="end" name={`Create New User`} />
        {/* <Button
          variant="primary"
          className="shadow-sm me-1"
          onClick={handleClick}
        >
          <FontAwesomeIcon icon={faPlus} /> Create New Holiday
        </Button> */}
        {/* <Button variant="primary" className="shadow-sm me-1">
          <Filter className="feather" />
        </Button> */}
        <Button
          variant="primary"
          className="shadow-sm"
          onClick={() => navigate("/pages/user")}
        >
          <RefreshCw className="feather" />
        </Button>
      </Col>
    </Row>
  );
};

export default UserHeader;
