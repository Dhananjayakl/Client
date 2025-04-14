import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ReportRuntime from "src/components/reports/Report";

const Default = (props) => {
  return (
    <Container fluid className="p-0 ">
      <div>
        <h4>Regulatory Compliance</h4>

        <Row id="scrollspyHeading1">
          <ReportRuntime report="GL_REGULATORY_SUMMERY_DC" dataCard />
        </Row>
      </div>
      <Row id="scrollspyHeading1">
        <Col>
          <ReportRuntime report="GL_REGULATORY_COM_DC" />
        </Col>
        <Col md={12}></Col>
      </Row>
    </Container>
  );
};

export default Default;
