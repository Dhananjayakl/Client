import React, { useState, useEffect } from "react";
import { ListGroup, Badge, ListGroupItem } from "react-bootstrap";

const Navigation = ({
  setSelectedObjectType,
  selectedObjectType,
  moduleData,
}) => {
  const totalObjects = Object.values(moduleData).reduce(
    (total, currentCategory) => {
      return total + currentCategory.length;
    },
    0
  );
  return (
    <ListGroup variant="flush" className="mt-1 m-0 vh-100 overflow-y-auto">
      <ListGroupItem
        onClick={() => setSelectedObjectType("")}
        active={selectedObjectType === ""}
        className=" d-flex pt-1  pb-2 pe-1  ps-1  justify-content-between 
        cursor-pointer align-items-center"
      >
        <span className="me-1">All objects</span>
        <Badge bg="warning" text="dark" className=" align-self-end" pill>
          {totalObjects}
        </Badge>
      </ListGroupItem>
      {Object.keys(moduleData).map((obj) => (
        <ListGroup.Item
          key={obj}
          onClick={() => {
            setSelectedObjectType(obj);
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }}
          active={selectedObjectType === obj}
          className="d-flex pt-1  pb-2 pe-1  ps-1  justify-content-between 
           cursor-pointer align-items-center"
        >
          <span className="me-1">
            {obj.charAt(0).toUpperCase() + obj.slice(1).toLowerCase()}
          </span>
          <Badge bg="warning" text="dark" className=" align-self-end" pill>
            {moduleData[obj]?.length}
          </Badge>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default Navigation;
