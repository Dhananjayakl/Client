import React from "react";
import { Helmet } from "react-helmet-async";
import { Container, Card, OverlayTrigger, Tooltip } from "react-bootstrap";
import ReportRuntime from "src/components/reports/Report";
import { Row, Col, Tabs, Tab, Nav } from "react-bootstrap";
import Chart from "src/components/charts/Chart";
import VideoPlayer from "src/components/forms/reactformutils/elements/VideoPlayer";
import LandingPagesTitle from "src/components/pages/LandingPagesTitle";
import FormReportChartLink from "src/components/pages/FormReportChartLink";
import * as util from "src/components/forms/reactformutils/elements/formutilfunctions";
import { Upload } from "react-feather";
import { useSearchParams, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Default = () => {
  const [searchParams] = useSearchParams();
  const objectId = searchParams.get("objectId");
  let userId = JSON.parse(localStorage.current_logged_User)[0].user_details
    .data[0].user_id;

  let reports = [
    {
      title: "Reporting Obligation",
      report: "CT_REPORTING_OBLIGATIONS",
      privilege: "CT_CREATE_REP_OBLIGATION",
    },
    {
      title: "Obligation Tasks",
      report: "CT_OBLIGATION_TASKS",
      privilege: "CT_CREATE_OBLIGATION_TASK",
    },
    {
      title: "Obligation Findings",
      report: "CT_OBLIGATIONS_FND",
      privilege: "CT_CREATE_OBLIGATION_TASK",
    },
    {
      title: "Compliance Status",
      report: "CT_COMPLIANCE_STATUS",
      privilege: "CT_COM_VIEW_REPORT",
    },
    {
      title: "Cancelled Obligation Tasks",
      report: "CT_CANCELLED_OBLIGATION_TASKS",
      privilege: "CT_CREATE_OBLIGATION_TASK",
    },
  ];
  const combinedItems = [
    ...reports.map((item) => ({ ...item, type: "report" })),
    //  <FormReportChartLink combinedItems={combinedItems} />
  ];
  const { t } = useTranslation("common");
  return (
    <Container fluid className="p-0 ">
      {/* <FormReportChartLink combinedItems={combinedItems} />  */}
      <Tab.Container id="menu" defaultActiveKey="ProcessCompliance">
        <Card className="sticky-top px-2 py-1 mb-3" style={{ zIndex: "1" }}>
          <Row className="ps-2">
            <PageNavigation />
          </Row>
        </Card>
        <LandingPagesTitle title={t("Compliance Review")} />
        <FormReportChartLink combinedItems={combinedItems} />
        <Tab.Content className="bg-white pt-3">
          <Tab.Pane eventKey="ProcessCompliance">
            <ProcessCompliance objectId={objectId} />
          </Tab.Pane>

          <Tab.Pane eventKey="RegulatoryCompliance">
            <RegulatoryCompliance objectId={objectId} />
          </Tab.Pane>
          <Tab.Pane eventKey="ReportingObligation">
            <ReportingObligation objectId={objectId} />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
};

const ProcessCompliance = ({ objectId }) => {
  const [searchParams] = useSearchParams();
  const d_source = searchParams.get("d_source");
  let userId = JSON.parse(localStorage.current_logged_User)[0].user_details
    .data[0].user_id;
  const framework = 2;
  return (
    <>
      <Helmet title="Control Testing" />
      <Container fluid className="p-0 ">
        <Row className="p-0 m-0">
          <ReportRuntime
            report="CT_ON_GOING_SEFT_ASSESSMENT"
            drilldownReports={{ frameworkID: framework }}
          />
        </Row>
        <Row className="p-0 m-0">
          <ReportRuntime
            report="CT_BUSINESS_OVERALL-ASSESSMENT"
            dataCard
            drilldownReports={{ frameworkID: framework }}
          />
        </Row>
      </Container>
    </>
  );
};

const RegulatoryCompliance = ({ objectId }) => {
  const [searchParams] = useSearchParams();
  const d_source = searchParams.get("d_source");
  let userId = JSON.parse(localStorage.current_logged_User)[0].user_details
    .data[0].user_id;

  const framework = 1;

  return (
    <>
      <Helmet title="Control Testing" />
      <Container fluid className="p-0 ">
        <Row className="p-0 m-0">
          <ReportRuntime
            report="CT_ON_GOING_SEFT_ASSESSMENT"
            drilldownReports={{ frameworkID: framework }}
          />
        </Row>
        <Row className="p-0 m-0">
          <ReportRuntime
            report="CT_BUSINESS_OVERALL-ASSESSMENT"
            dataCard
            drilldownReports={{ frameworkID: framework }}
          />
        </Row>
      </Container>
    </>
  );
};

const ReportingObligation = ({ objectId }) => {
  const [searchParams] = useSearchParams();
  const d_source = searchParams.get("d_source");
  return (
    <>
      <Row className="p-0 m-0">
        <div className="pt-2 col-md-12">
          <Col>
            <ReportRuntime report="CT_REPORTING_OBLIGATIONS" dataCard />
          </Col>
        </div>
      </Row>
    </>
  );
};

const PageNavigation = () => {
  const { t } = useTranslation("common");
  return (
    <Nav
      variant="underline"
      defaultActiveKey="ProcessCompliance"
      className="justify-content-start mt-1"
    >
      <Nav.Item>
        <Nav.Link eventKey="ProcessCompliance" className="py-0">
          {t("Process Compliance")}
        </Nav.Link>
      </Nav.Item>

      <Nav.Item>
        <Nav.Link eventKey="RegulatoryCompliance" className="py-0">
          {t("Regulatory Compliance")}
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="ReportingObligation" className="py-0">
          {t("Reporting Obligation")}
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
};

export default Default;
