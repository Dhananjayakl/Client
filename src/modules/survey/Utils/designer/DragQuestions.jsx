import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useDrag } from "react-dnd";
import { Col, Row, ListGroup, Button, Card, Modal } from "react-bootstrap";

const DragQuestions = ({ fieldName, icon }) => {
  const [{ isDraggingField }, dragField] = useDrag(() => ({
    type: "question",
    item: { FieldName: fieldName },
    collect: (monitor) => ({
      isDraggingField: !!monitor.isDragging(),
    }),
  }));

  return (
    <ListGroup.Item
      ref={dragField}
      className={`p-1 d-flex align-items-center text-wrap bg-light-subtle${
        isDraggingField ? "text-dark active" : "text-dark form-label p-0 m-0"
      }`}
    >
      <FontAwesomeIcon
        style={{ width: "24px" }}
        className={`me-2 ${isDraggingField ? "" : "text-dark"}`}
        icon={icon}
      />
      <span className={isDraggingField ? "" : "text-dark"}>
        {fieldName.charAt(0).toUpperCase() + fieldName.slice(1).toLowerCase()}
      </span>
    </ListGroup.Item>
  );
};

export default DragQuestions;
