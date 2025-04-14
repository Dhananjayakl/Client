import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ReportRuntime from "src/components/reports/Report";

const Default = (props) => {
  return (
    <Container fluid className="p-0 ">
      <div>
        <h4>Business Resilience</h4>

        <Row id="scrollspyHeading1">
          <ReportRuntime report="GL_PROCESS_SUMMARY_DC" dataCard />
        </Row>
      </div>
      <Row id="scrollspyHeading1">
        <Col>
          <ReportRuntime report="GL_BUSINESS_RES_PROCESS" />
        </Col>
        <Col md={4}></Col>
      </Row>
    </Container>
  );
};

export default Default;
