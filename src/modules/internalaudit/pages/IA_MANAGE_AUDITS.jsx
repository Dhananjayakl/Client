import { Helmet } from "react-helmet-async";
import { Container } from "react-bootstrap";
import ReportRuntime from "src/components/reports/Report";
import { Row, Col } from "react-bootstrap";
import * as util from "src/components/forms/reactformutils/elements/formutilfunctions";
import FormLink from "src/components/pages/FormLink";
import LandingPagesTitle from "src/components/pages/LandingPagesTitle";
import FormReportChartLink from "src/components/pages/FormReportChartLink";
import Chart from "src/components/charts/Chart";
import GL_GRC_FRAMEWORKS from "src/modules/grc/pages/GL_GRC_FRAMEWORKS.jsx";
import { useTranslation } from "react-i18next";

const Default = () => {
  let privs = util.getCurrentUser().privileges?.split(",");
  const { t } = useTranslation("common");

  let forms = [];
  forms = [
    {
      title: "Create Auditable Entity",
      form: "auditableEntity",
      privilege: "IA_CREATE_AE",
    },
    {
      title: "Create Audit Plan",
      form: "auditplan",
      privilege: "IA_CREATE_PLAN",
    },
    {
      title: "Create Audit",
      form: "audits",
      privilege: "IA_CREATE_AUDIT",
    },
    {
      title: "Internal Audits Framework",
      form: "internalaudits",
      privilege: "GL_IA_CREATE",
      upload: true,
    },
  ];

  let reports = [
    {
      title: "Auditable Entities",
      report: "IA_AUDITABLE_ENTITIES",
      privilege: "IA_VIEW_AE",
    },
    {
      title: "Audit Plans",
      report: "IA_AUDIT_PLANS",
      privilege: "IA_VIEW_PLAN",
    },
    {
      title: "Audits",
      report: "IA_ALL_AUDITS",
      privilege: "IA_VIEW_AUDIT",
    },
    {
      title: "Audit Workpapers",
      report: "IA_AUDIT_WORKPAPERS_RPT",
      privilege: "IA_VIEW_WORKPAPER",
    },
    // {
    //   title: "Internal Audits Framework ",
    //   report: "GL_INTERNAL_AUDITS",
    //   privilege: "GL_IA_CREATE",
    // }
  ];

  let chart = [
    {
      title: "Audits by Quarter",
      chart: "IA_AUDITS_BY_QUARTER",
      privilege: "IA_VIEW_PLAN",
    },
  ];

  const FormsandReport = () => {
    const combinedItems = [
      ...forms.map((item) => ({ ...item, type: "form" })),
      ...reports.map((item) => ({ ...item, type: "report" })),
      ...chart.map((item) => ({ ...item, type: "chart" })),
    ];

    return (
      <>
        <div>
          <FormReportChartLink combinedItems={combinedItems} />
          {privs.includes("IA_CREATE_PLAN") && <GL_GRC_FRAMEWORKS />}
        </div>
      </>
    );
  };

  return (
    <>
      <Helmet title="Manage Audits" />
      <Container fluid className="p-0 ">
        <div>
          <LandingPagesTitle
            title={t("Manage Audits")}
            configrationForm="iaconfiguration"
            privileges="IA_CREATE_PLAN"
            navBar={[
              {
                title: t("Audit Dashboard"),
                type: "PAGE",
                name: "IA_AUDIT_PLANS",
                privileges: "IA_VIEW_PLAN",
              },
            ]}
          />
        </div>
        <div className="row  row-cols-sm-1">
          <FormsandReport />
        </div>
        <div className="">
          {privs.includes("IA_CREATE_WORKPAPER") && (
            <>
              <Row>
                <ReportRuntime report="IA_MY_AUDITS" />
              </Row>
              <Row>
                <ReportRuntime report="IR_ISSUE_AUDITEE_REVIEW" />
              </Row>
            </>
          )}
          {privs.includes("IA_REVIEW_FINDINGS") && (
            <>
              <Row>
                <ReportRuntime report="IR_ISSUE_AUDITEE_REVIEW" />
              </Row>
              <Row>
                <ReportRuntime report="IR_ALL_AUDITS_FINDINGS" />
              </Row>
            </>
          )}
          {privs.includes("IA_REVIEW_AUDIT_REPORT") && (
            <Row>
              <ReportRuntime report="IA_AUDIT_REPORT_REVIEW" />
            </Row>
          )}
        </div>
        <div>
          {privs.includes("IA_VIEW_PLAN") && (
            <>
              <div className="pe-0">
                <Row id="scrollspyHeading1">
                  <Col>
                    <Chart chart="IA_AUDITABLE_ENTITY_SCOPE_CHART" />
                  </Col>
                  <Col>
                    <Chart chart="IA_AUDIT_PLANS_BY_STATUS" />
                  </Col>
                  <Col>
                    <Chart chart="IA_AUDITS_BY_STATUS" />
                  </Col>
                </Row>
                <Row id="scrollspyHeading1">
                  <Col>
                    <Chart chart="IA_AUDIT_WORKPAPER_STATUS_CHART" />
                  </Col>
                  <Col>
                    <Chart chart="IR_FINDINGS_BY_STATUS" />
                  </Col>
                </Row>
              </div>
            </>
          )}
        </div>
      </Container>
    </>
  );
};

export default Default;
