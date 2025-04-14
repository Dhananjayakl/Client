import React from "react";
import { Helmet } from "react-helmet-async";
import { Container, Row, Col } from "react-bootstrap";
import ReportRuntime from "src/components/reports/Report";
import Chart from "src/components/charts/Chart";
import LandingPagesTitle from "src/components/pages/LandingPagesTitle";
import FormReportChartLink from "src/components/pages/FormReportChartLink";

const Default = () => {
  //   let forms = [];
  //   let reports = [
  //     {
  //       title: "Dynamic Risk Rating",
  //       report: "RA_RISK_IN_MOTION",
  //       privilege: "RA_CHIEF_RISK_OFFICER",
  //     },
  //     {
  //       title: "Risk Register",
  //       report: "RA_AGGREGATE_RISK",
  //       privilege: "RA_CHIEF_RISK_OFFICER",
  //     },
  //   ];
  //   let chart = [];

  //   const combinedItems = [
  //     ...forms.map((item) => ({ ...item, type: "form" })),
  //     ...reports.map((item) => ({ ...item, type: "report" })),
  //     ...chart.map((item) => ({ ...item, type: "chart" })),
  //   ];
  return (
    <>
      <Helmet title="Risk Assessments" />
      <Container fluid className="p-0 ">
        <div>
          <Row>
            <Col className="mx-3 px-2">
              <ReportRuntime report="RA_LATEST_RISK_REGISTRY" pivotTable />
            </Col>
          </Row>
          <Row>
            <Col>
              <ReportRuntime report="RA_RISK_STATUS" dataCard />
            </Col>
          </Row>
          <Row className="p-0 m-0" id="scrollspyHeading1">
            <ReportRuntime report="RA_RISK_IN_MOTION" />
          </Row>
          <Row className="p-0 m-0">
            <Col md={6}>
              <ReportRuntime report="RA_RISK_TOP" />
            </Col>
            <Col md={6}>
              <Chart chart="GL_KRI_CHART" />
            </Col>
          </Row>
          <Row className="p-0 m-0" id="scrollspyHeading1">
            <Col md={6}>
              <Chart chart="RA_RISK_REGISTER_ROLLUP" />
            </Col>
            <Col md={6}>
              <Chart chart="RA_HEAT_MAP_CRO" />
            </Col>
          </Row>
        </div>
      </Container>
    </>
  );
};

export default Default;
