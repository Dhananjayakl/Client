import React from "react";
import { Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
let ReadOnly = (props) => {
  let navigate = useNavigate();

  if (props.type == "readonly") {
    return (
      <Form.Group>
        <Form.Label htmlFor={props.id} className="text-dark">
          {props.field_title}
        </Form.Label>
        <div className="text-break">
          {props.link && (
            <a
              onClick={() =>
                navigate(
                  `/form/runtime?formService=${props.service}&objectId=${props.id}`
                )
              }
              target="_blank"
              className="me-2"
            >
              {props.value}
            </a>
          )}
          {!props.link && props.value}
        </div>
      </Form.Group>
    );
  } else if (props.type == "readonlyoneline") {
    return;
    <Row>
      <Col className="text-dark form-label">{props.field_title}</Col>
      <Col>{props.value}</Col>
    </Row>;
  }
};

export default ReadOnly;
