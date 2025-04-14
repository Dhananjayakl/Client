import React from "react";
import { Col, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import LeaveRequest from "src/components/forms/reactformutils/FormRuntimeEngine";
import { OffCanvasForm } from "src/components/pages/OneObjectLandingPage";

const Header = () => {
  return (
    <Row className="mb-2 mb-xl-3">
      <Col xs="auto" className="d-none d-sm-block">
        <h3>Leave Management</h3>
      </Col>

      <Col xs="auto" className="ms-auto text-end mt-n1">
        <OffCanvasForm
          placement="end"
          buttonText={
            <span>
              <FontAwesomeIcon icon={faPlus} /> Apply Leave
            </span>
          }
          canvasTitle="Apply Leave"
          component={<LeaveRequest formService="leaveRequest" objectId={-1} />}
        />
      </Col>
    </Row>
  );
};

export default Header;
