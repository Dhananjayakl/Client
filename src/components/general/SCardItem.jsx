import React from "react";
import { Badge, Col, Row } from "react-bootstrap";

let SCardItem = (props) => {
  return (
    <Row className="mb-0">
      {/* <Badge bg="secondary" className=" me-2"> */}
      <Col xs={4}>
        <strong>{props.value.key}</strong>
      </Col>
      {/* </Badge> */}
      <Col xs={8}>
        <span className="text-muted">
          {"  "}
          {props.value.value}
        </span>
      </Col>
    </Row>
  );
};

export default SCardItem;
