import React from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, ListGroup } from "react-bootstrap";

const NotificationItem = ({ icon, taskDetails, taskName, time, spacing }) => {
  const navigate = useNavigate();

  return (
    <ListGroup.Item>
      <Row className="align-items-center g-0 overflow-auto">
        {icon && <Col xs={2}>{icon}</Col>}
        <Col
          xs={10}
          className={spacing ? "pl-2" : null}
          onClick={() => {
            navigate(
              `/form/runtime?formService=${taskDetails.form_service.replace(
                /^\/+/,
                ""
              )}&objectId=${taskDetails.object_id}`
            );
          }}
        >
          <div
            className="text-info d-inline-block text-truncate"
            style={{ maxWidth: "350px" }}
          >
            {taskName}
          </div>
          <div className="text-dark small mt-1">{time}</div>
        </Col>
      </Row>
    </ListGroup.Item>
  );
};
export default NotificationItem;
