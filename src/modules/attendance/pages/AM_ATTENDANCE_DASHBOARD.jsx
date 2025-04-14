import React from "react";
import { Helmet } from "react-helmet-async";
import { Container, Row, Col } from "react-bootstrap";
import ReportRuntime from "src/components/reports/Report";

const Default = () => {
  return (
    <React.Fragment>
      <Helmet title="Attendance Management" />
      <Container fluid className="pb-5">
        <h1>Attendance Dashboard</h1>
        <Row className="d-flex justify-content-center">
          <ReportRuntime report="AM_ATTENDANCE_LOG_REPORT" />
        </Row>
      </Container>
    </React.Fragment>
  );
};

export default Default;
