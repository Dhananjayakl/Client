import React from "react";
import { Card } from "react-bootstrap";
import SCardItem from "./SCardItem";

let SCard = (props) => {
  const Listitems = props.values.map((value) => <SCardItem value={value} />);
  console.log(Listitems);
  return (
    <Card className="flex-fill">
      <Card.Header>
        <Card.Title className="m-0 p-0">{props.title}</Card.Title>
        <hr className="mb-0" />
      </Card.Header>
      <Card.Body className=" py-1">
        <div className="d-flex align-items-start">
          <div className="flex-grow-1">{Listitems}</div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default SCard;
