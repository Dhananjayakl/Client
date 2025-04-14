import React from "react";
import { Button, Row, Col } from "react-bootstrap";

export const Header = (props) => {
  // console.log(props);

  let { title, forform } = props;
  return (
    <>
      <Row className="mb-2 mb-xl-3">
        <Col xs="auto" className="d-none d-sm-block">
          <h3>{title}</h3>
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

          <Button variant="primary" form={forform}>
            {/* //onClick={() => navigate("/leave/default")}> */}
            {/* <RefreshCw className="feather" /> */}
            Submit
          </Button>
          <Button variant="light" onClick={() => navigate("/leave/default")}>
            {/* <RefreshCw className="feather" /> */}
            Close
          </Button>
        </Col>
      </Row>
    </>
  );
};
