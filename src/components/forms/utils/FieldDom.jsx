import React from "react";
import { Form } from "react-bootstrap";
import FieldToolTip from "./FieldToolTip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

const FieldDom = (props) => {
  console.log("fielddobprops", props);
  return (
    <Form.Group className="mb-3">
      <Form.Label>
        {props.label || (props.fieldDef && props.fieldDef.field_title)}
      </Form.Label>{" "}
      {props.required && <span className="text-danger">*</span>}
      <FieldToolTip tooltip={props.tooltip} />
      {props.children}
      {props.touched && props.error && (
        <Form.Control.Feedback type="invalid">
          {props.error}
        </Form.Control.Feedback>
      )}
      <Form.Text>{props.helptext}</Form.Text>
    </Form.Group>
  );
};

export default FieldDom;
