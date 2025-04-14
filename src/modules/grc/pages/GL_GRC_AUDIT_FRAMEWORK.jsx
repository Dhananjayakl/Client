import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ReportRuntime from "src/components/reports/Report";

const Default = (props) => {
  return (
    <Container fluid className="p-0 ">
      <div>
        <h4>Audit Compliance</h4>

        <Row id="scrollspyHeading1">
          <ReportRuntime report="IA_AUDIT_SUMMARY_DC" dataCard />
        </Row>
      </div>
      <Row id="scrollspyHeading1">
        <Col>
          <ReportRuntime report="IA_AUDITABLE_ENTITIES" />
        </Col>
        <Col md={12}></Col>
      </Row>
    </Container>
  );
};

export default Default;
