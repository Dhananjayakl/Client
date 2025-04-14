import React from "react";
import { Helmet } from "react-helmet-async";
import { Container, Row, Col } from "react-bootstrap";
import ReportRuntime from "src/components/reports/Report";
import Chart from "src/components/charts/Chart";
import LandingPagesTitle from "src/components/pages/LandingPagesTitle";
import FormReportChartLink from "src/components/pages/FormReportChartLink";
import * as util from "src/components/forms/reactformutils/elements/formutilfunctions";
import { useTranslation } from "react-i18next";

const Default = () => {
  let forms = [
    {
      title: "Initiate Risk Assessment",
      form: "triggerriskassessment",
      privilege: "RA_CREATE_RISK_ASSESSMENT",
      // upload: true,
    },
    {
      title: "Initiate Risk Acceptance",
      form: "riskAcceptance",
      privilege: "RA_CREATE_RISK_ASSESSMENT",
    },
  ];
  let privs = util.getCurrentUser().privileges?.split(",");

  let reports = [
    {
      title: "Risk Register",
      report: "RA_LATEST_RISK_REGISTRY",
      privilege: "RA_REASSIGN_ALL",
    },
    {
      title: "Requirement Register",
      report: "RA_REQUIREMENT_REGISTER",
      privilege: "RA_PERFORM_REG_COM_RISK",
    },
    {
      title: "Dynamic Risk Rating",
      report: "RA_RISK_IN_MOTION",
      privilege: "RA_REASSIGN_ALL",
    },
    {
      title: "Risk Acceptance",
      report: "RA_RISK_ACCEPTANCE",
      privilege: "RA_CREATE_RISK_ASSESSMENT",
    },
    {
      title: "Risk Aggregation by BU",
      report: "RA_RISK_REGISTER_ROLLUP_RPT",
      privilege: "RA_REASSIGN_ALL",
    },
    {
      title: "Critical Process",
      report: "RA_PROCESS_RATING",
      privilege: "RA_REASSIGN_ALL",
    },
  ];
  let chart = [
    {
      title: "Risks By Category",
      chart: "GL_RISK_CATEGORY",
      privilege: "RA_CREATE_RISK_ASSESSMENT",
    },
  ];

  const combinedItems = [
    ...forms.map((item) => ({ ...item, type: "form" })),
    ...reports.map((item) => ({ ...item, type: "report" })),
    ...chart.map((item) => ({ ...item, type: "chart" })),
  ];

  const { t } = useTranslation("common");
  return (
    <>
      <Helmet title="Risk Assessments" />
      <Container fluid className="p-0 ">
        <LandingPagesTitle
          title={t("Risk Outlook")}
          configrationForm={"riskconfig"}
          privileges={"GL_CREATE_GRC"}
        />
        <div>
          <Row className="p-0 m-0">
            <FormReportChartLink combinedItems={combinedItems} />
          </Row>
          {!privs.includes("RA_PERFORM_REG_COM_RISK") && (
            <>
              <Row id="scrollspyHeading1">
                <Col className="p-0 m-0">
                  <ReportRuntime report="GL_RISK" dataCard />
                </Col>
                {/* <Col className="p-0 m-0">
                  <ReportRuntime report="GL_RELATED_RISKS" dataCard />
                </Col> */}
                <Col className="p-0 m-0">
                  <ReportRuntime report="GL_ORPHAN_RISKS" dataCard />
                </Col>
                <Col className="p-0 m-0">
                  <ReportRuntime report="GL_ASSESSED_RISK" dataCard />
                </Col>
                <Col className="p-0 m-0">
                  <ReportRuntime report="GL_ASSESSED_CONTROL" dataCard />
                </Col>
                <Col className="p-0 m-0">
                  <ReportRuntime report="RA_RISK_REGISTRY" dataCard />
                </Col>
              </Row>
              <Row id="scrollspyHeading1">
                <ReportRuntime report="RA_ON_GOING_RISK_ASSESSMENT" />
              </Row>
              <Row id="scrollspyHeading1">
                <ReportRuntime report="RA_RISK_STATUS" dataCard />
              </Row>
              <Row id="scrollspyHeading1">
                <ReportRuntime report="RA_RISK_IN_MOTION" />
              </Row>
            </>
          )}
          {privs.includes("RA_CREATE_RISK_ASSESSMENT") &&
            !privs.includes("RA_PERFORM_REG_COM_RISK") && (
              <Row id="scrollspyHeading1">
                <Col md={6}>
                  <Chart chart="RA_HEAT_MAP" />
                </Col>
                <Col md={6}>
                  <Chart chart="GL_KRI_CHART" />
                </Col>
              </Row>
            )}
          {privs.includes("RA_CREATE_RISK_ASSESSMENT") &&
            !privs.includes("RA_PERFORM_REG_COM_RISK") && (
              // <div className="pe-4">
              <>
                <Row id="scrollspyHeading1">
                  <Col>
                    <Chart chart="RA_RISK_ASSESSMENT_FINDINGS" />
                  </Col>
                  {/* <Col>
                  <Chart chart="RA_RISK_RESIDUAL_RATING" />
                </Col> */}
                  {/* <Col>
                  <Col>
                    <Chart chart="RA_RISK_REGISTER_ROLLUP" />
                  </Col>
                </Col> */}

                  <Col lg={6}>
                    <ReportRuntime report="RA_RISK_AGING" pivotTable />
                  </Col>
                </Row>
              </>
              // </div>
            )}

          {privs.includes("RA_PERFORM_REG_COM_RISK") && (
            <>
              <Row id="scrollspyHeading1">
                <ReportRuntime report="RA_ON_GOING_RISK_REGULATORY" />
              </Row>
              <Row id="scrollspyHeading1">
                <ReportRuntime report="RA_REG_COMP_STATUS" dataCard />
              </Row>
              <Row id="scrollspyHeading1">
                <Col lg={6}>
                  <Chart chart="RA_RISK_ASSESSMENT_FINDING_REG_COMP" />
                </Col>
                <Col lg={6}>
                  <Chart chart="RA_RISK_RESIDUAL_RATING_REG_COMP" />
                </Col>
                <Col></Col>
              </Row>
            </>
          )}
          {privs.includes("RA_CREATE_RISK_ASSESSMENT") && (
            <Row id="scrollspyHeading1">
              <Col lg={6}>
                <ReportRuntime report="RA_SOURCE_STATUS" pivotTable />
              </Col>
              <Col lg={6}>
                <ReportRuntime report="RA_BY_BUSINESS_UNIT" pivotTable />
              </Col>
            </Row>
          )}
        </div>
      </Container>
    </>
  );
};

export default Default;
