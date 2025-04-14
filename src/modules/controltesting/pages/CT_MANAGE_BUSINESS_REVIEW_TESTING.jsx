import React from "react";
import { Helmet } from "react-helmet-async";
import { Container, Card, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faPencil } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import ReportRuntime from "src/components/reports/Report";
import { Row, Col, Tabs, Tab, Nav } from "react-bootstrap";
import Chart from "src/components/charts/Chart";
import FormLink from "src/components/pages/FormLink";
import LandingPagesTitle from "src/components/pages/LandingPagesTitle";
import FormReportChartLink from "src/components/pages/FormReportChartLink";
import * as util from "src/components/forms/reactformutils/elements/formutilfunctions";
import { useSearchParams } from "react-router-dom";
import Processposture from "../manageBusinessRevew/ProcessbuReview";
import Regulatoryposture from "../manageBusinessRevew/RegulatorybuReview";
import Reportingposture from "../manageBusinessRevew/ReportingObligationbusinessreview";
import { useTranslation } from "react-i18next";
import { t } from "i18next";

const Default = () => {
  const [searchParams] = useSearchParams();
  const objectId = searchParams.get("objectId");
  // const d_source= searchParams.get("d_source")
  let privs = util.getCurrentUser().privileges?.split(",");
  const initialTab = window.history.state?.activeTab || "ProcessCompliance";
  const [activeTab, setActiveTab] = useState(initialTab);
  console.log("activeTab", initialTab, activeTab);

  const handleSelect = (key) => {
    setActiveTab(key);
    window.history.replaceState({ activeTab: key }, "");
  };
  let forms = [
    {
      title: "Initiate Business Review",
      form: "selfassessment",
      privilege: "CT_CREATE_TEST_EXECUTION",
    },
    {
      title: "Reporting Obligation",
      form: "reportingobligations",
      privilege: "CT_CREATE_REP_OBLIGATION",
    },
  ];
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
      title: "Control Compliance Status",
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
    ...forms.map((item) => ({ ...item, type: "form" })),
    ...reports.map((item) => ({ ...item, type: "report" })),
  ];

  const { t } = useTranslation("common");

  return (
    <>
      <Helmet title="Control Testing" />
      <Container fluid className="p-0 ">
        <div>
          <LandingPagesTitle
            title={t("Compliance Outlook")}
            configrationForm={"complianceconfig"}
            privileges={"CT_COMPLIANCE_ADMIN"}
          />

          {/* <FormReportChartLink combinedItems={combinedItems} /> */}
        </div>
        <FormReportChartLink combinedItems={combinedItems} />
        <Tab.Container id="menu" activeKey={activeTab} onSelect={handleSelect}>
          <Card className="sticky-top px-2 py-1 mb-3" style={{ zIndex: "1" }}>
            <Row className="ps-2">
              <PageNavigation />
            </Row>
          </Card>

          <Tab.Content className="bg-white pt-3">
            <Tab.Pane eventKey="ProcessCompliance">
              <Processposture objectId={objectId} />
            </Tab.Pane>

            <Tab.Pane eventKey="RegulatoryCompliance">
              <Regulatoryposture objectId={objectId} />
            </Tab.Pane>
            <Tab.Pane eventKey="ReportingObligation">
              <Reportingposture objectId={objectId} />
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Container>
    </>
  );
};

const PageNavigation = () => {
  const [activeTab, setActiveTab] = useState("ProcessCompliance");
  const { t } = useTranslation("common");

  return (
    <Nav
      variant="underline"
      defaultActiveKey="ProcessCompliance"
      className="justify-content-start mt-1"
      onSelect={(selectedKey) => setActiveTab(selectedKey)}
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
