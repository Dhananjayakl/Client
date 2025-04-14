import React from "react";
import { Helmet } from "react-helmet-async";
import ReportRuntime from "src/components/reports/Report";
import {
  Container,
  Row,
  Col,
  Tabs,
  Tab,
  Button,
  ButtonToolbar,
  ButtonGroup,
  Form,
  Card,
  Breadcrumb,
  Badge,
  Nav,
} from "react-bootstrap";
import {
  faFilePdf,
  faArrowsSpin,
  faTriangleExclamation,
  faCheckToSlot,
  faComments,
  faBriefcase,
  faPencil,
  faHome,
  faRefresh,
  faUser,
  faFileAlt,
} from "@fortawesome/free-solid-svg-icons";
import Chart from "src/components/charts/Chart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import VideoPlayer from "src/components/forms/reactformutils/elements/VideoPlayer";
import LandingPagesTitle from "src/components/pages/LandingPagesTitle";
import FormReportChartLink from "src/components/pages/FormReportChartLink";
import * as util from "src/components/forms/reactformutils/elements/formutilfunctions";
import { Upload } from "react-feather";
import { useSearchParams, useLocation, useNavigate } from "react-router-dom";
 
const Default = () => {
  const [searchParams] = useSearchParams();
  const objectId = searchParams.get("objectId");
  console.log(objectId, "objectIdobjectId");
 
  const d_source = searchParams.get("d_source");

 
  return (
    <>
      <Helmet title="Control Testing" />
      <Container fluid className="p-0 ">
        <Tab.Container id="menu" defaultActiveKey="ProcessCompliance">
          <Card className="sticky-top px-2 py-1 mb-3" style={{ zIndex: "1" }}>
            <Row className="ps-2">
              <PageNavigation />
            </Row>
          </Card>
 
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
    </>
  );
};
 
const ProcessCompliance = ({ objectId }) => {
  let privs = util.getCurrentUser().privileges?.split(",");
  let framework=2
  let reports = [
    {
      title: "Compliance Status",
      report: "CT_COMPLIANCE_STATUS",
      privilege: "CT_COM_VIEW_REPORT",
    },
  ];
  const combinedItems = [
    ...reports.map((item) => ({ ...item, type: "report" })),
  ];
 
  return (
    <>
      <div>
        <FormReportChartLink combinedItems={combinedItems} />
      </div>
      <Row>
        <Col xs={12} md={6} lg={6}>
          <Chart
            chart="CT_CONTROL_COMPLIANCE_STATUS"
           />
        </Col>
        
        <Col xs={12} md={6} lg={6}>
          <Chart
            chart="CT_PROCESS_COM_STATUS"
            defaultFilter={{ processId: framework }}
            customExpressionFlag />
        </Col>
      </Row>
      <Col xs={12} md={6} lg={12}>
          <ReportRuntime report="CT_CCO_WEAK_CONTROL" />
        </Col>
      <Row>
        <Col xs={12} md={6} lg={12}>
          <ReportRuntime report="CT_CCO_PROCESS_COMPLIANCE_STATUS" pivotTable />
        </Col>
        <Col xs={12} md={6} lg={6}>
          <Chart chart="CT_CCO_HEAT_MAP_PROCESS" />
        </Col>
        <Col xs={12} md={6} lg={6}>
          <Chart chart="CT_PROCESS_COMPLIANCE_STATUS_CCO" />
        </Col>
 
        
      </Row>
 
      
    </>
  );
};
 
const RegulatoryCompliance = ({ objectId }) => {
  let privs = util.getCurrentUser().privileges?.split(",");
  let framework=1
  let reports = [
   
    {
      title: "Compliance Status",
      report: "CT_COMPLIANCE_STATUS",
      privilege: "CT_COM_VIEW_REPORT",
    },

  ];
  const combinedItems = [
    ...reports.map((item) => ({ ...item, type: "report" })),
  ];
 
  return (
    <>
      <div>
        <FormReportChartLink combinedItems={combinedItems} />
      </div>
      <Row>
      <Col xs={12} md={6} lg={6}>
          <Chart
            chart="CT_CONTROL_COMPLIANCE_STATUS"
            />
        </Col>
        <Col xs={12} md={6} lg={6}>
          <Chart
            chart="CT_REQUIREMENT_COM_STATUS"
            defaultFilter={{ processId: framework }}
            customExpressionFlag/>
        </Col>
      </Row>
      <Col xs={12} md={6} lg={12}>
          <ReportRuntime report="CT_CCO_WEAK_CONTROL" drilldownReports={{ processId:1}}
            customExpressionFlag />
        </Col>
      <Row>
        <Col xs={12} md={6} lg={12}>
          <ReportRuntime report="CT_CCO_REQUIREMENT_COMPLIANCE_STATUS" pivotTable />
        </Col>
        <Col xs={12} md={6} lg={6}>
          <Chart chart="CT_CCO_HEAT_MAP_REQUIREMENT" />
        </Col>
        <Col xs={12} md={6} lg={6}>
          <Chart chart="CT_REQUIREMENT_COMPLIANCE_STATUS_CCO" />
        </Col>
      </Row>
    </>
  );
};


const ReportingObligation = ({ objectId }) => {
  let privs = util.getCurrentUser().privileges?.split(",");
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
      title: " Obligation Findings",
      report: "CT_OBLIGATIONS_FND",
      privilege: "CT_CREATE_OBLIGATION_TASK",
    },
    {
      title: "Cancelled Obligation Tasks",
      report: "CT_CANCELLED_OBLIGATION_TASKS",
      privilege: "CT_CREATE_OBLIGATION_TASK",
    },
  ];
  const combinedItems = [
    ...reports.map((item) => ({ ...item, type: "report" })),
  ];
 
  return (
    <>
      <div>
        <FormReportChartLink combinedItems={combinedItems} />
      </div>
      <Row id="scrollspyHeading1">
        <ReportRuntime report="CT_REPORTING_OBLIGATIONS" dataCard />
      </Row>
 
      <Row id="scrollspyHeading1">
        <Col xs={12} md={6} lg={6}>
          <Chart chart="CT_OBLIGATION_TASK_BY_CATEGORY" />
        </Col>
        <Col xs={12} md={6} lg={6}>
          <Chart chart="CT_OBLIGATION_COMPLETION_STATUS" />
        </Col>
        <Row className="" id="scrollspyHeading1">
          <div>
            <Col>
              <Chart chart="CT_OBLIGATION_BY_SOURCE" />
            </Col>
            <Col>
              <Chart chart="CT_OBLIGATION_TASKS_BY_DUE" />
            </Col>
          </div>
        </Row>
      </Row>
      
    </>
  );
};
 
const PageNavigation = () => {
  return (
    <Nav
      variant="underline"
      defaultActiveKey="ProcessCompliance"
      className="justify-content-start mt-1"
    >
      <Nav.Item>
        <Nav.Link eventKey="ProcessCompliance" className="py-0">
          Process Compliance
        </Nav.Link>
      </Nav.Item>
 
      <Nav.Item>
        <Nav.Link eventKey="RegulatoryCompliance" className="py-0">
          Regulatory Compliance
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="ReportingObligation" className="py-0">
        Reporting Obligation
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
};
 
export default Default;