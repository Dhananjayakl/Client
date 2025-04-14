import ReportRuntime from "src/components/reports/Report";
import { Row, Col, Card } from "react-bootstrap";
import { useEffect, useState } from "react";
import * as util from "src/components/forms/reactformutils/elements/formutilfunctions";
import FormReportChartLink from "src/components/pages/FormReportChartLink";
import LandingPagesTitle from "src/components/pages/LandingPagesTitle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faArrowUp, faEdit } from "@fortawesome/free-solid-svg-icons";
import Chart from "src/components/charts/Chart";
import { getviewData, getActionCode } from "src/modules/loss/lossFormService";
import { useTranslation } from "react-i18next";
const Default = () => {
  const { t } = useTranslation("common");
  let reports = [
    {
      title: "Internal Loss Events",
      report: "LE_INTERNAL_LOSS_EVENT",
      privilege: "LE_VIEW_INTERNAL_LOSS_EVENT",
    },
    {
      title: "Loss Event Workflow Status",
      report: "LE_WORKFLOW_STATUS",
      privilege: "LE_VIEW_INTERNAL_LOSS_EVENT",
    },
    {
      title: "Comprehensive Loss Events",
      report: "LE_COMPREHENSIVE_LOSS_EVENTS",
      privilege: "LE_VIEW_INTERNAL_LOSS_EVENT",
    },
    {
      title: "Top 5 Loss Event(s)",
      report: "LE_TOP_LOSS_EVENT",
      privilege: "LE_LOSS_ADMIN",
    },
  ];

  let forms = [
    {
      title: "Internal Loss Event",
      form: "internallossevent",
      privilege: "LE_CREATE_LOSS_EVENT",
    },
    // {
    //   title: "Internal Loss Event",
    //   form: "internallossevent",
    //   privilege: "",
    // },
  ];
  let chart = [
    {
      title: "Loss By Basel Category (Level 1)",
      chart: "LE_LOSS_BY_BCG_ONE",
      privilege: "LE_LOSS_ADMIN",
    },

    {
      title: "Issues Reported in Loss",
      chart: "IR_ISSUES_BY_LOSS",
      privilege: "LE_LOSS_ADMIN",
    },

    {
      title: "Total Loss Incidents",
      chart: "LE_TOTAL_LOSS_INCIDENTS",
      privilege: "LE_LOSS_ADMIN",
    },
    {
      title: "Quarter-Wise Trend Chart",
      chart: "LE_QUARTER_WISE_TREND_CHART",
      privilege: "LE_LOSS_ADMIN",
    },
    {
      title: "Loss Severity Distribution",
      chart: "LE_LOSS_BY_DISGTRIBUTION",
      privilege: "LE_LOSS_ADMIN",
    },
  ];
  let privs = util.getCurrentUser().privileges?.split(",");
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [TopLoss, setTopLoss] = useState([]);
  let TopLossView = {
    viewName: "PA_LE_TOP_LOSS_EVENT_V",
    pageNumber: 0,
    pageSize: 0,
    sortField: "",
    sortOrder: "",
    orderExpression: "",
    filterExpression: "",
  };

  useEffect(() => {
    getviewData(TopLossView)
      .then((response) => {
        setTopLoss(response.data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 680px)");
    setIsLargeScreen(mediaQuery.matches);
    const handleResize = () => {
      setIsLargeScreen(mediaQuery.matches);
    };
    mediaQuery.addEventListener("change", handleResize);
    return () => {
      mediaQuery.removeEventListener("change", handleResize);
    };
  }, []);

  const DataCard = () => {
    return (
      <>
        <div>
          <Row></Row>
        </div>
      </>
    );
  };

  const Charts = () => {
    const { t } = useTranslation("Common");
    return (
      <>
        <Row>
          <Col xs={12} md={3} lg={6}>
            <Chart chart="LE_LOSS_BY_STATUS" />
          </Col>

          <Col xs={12} md={3} lg={6}>
            <Card>
              <div
                className="table-responsive"
                style={{ maxHeight: "435px", overflowY: "auto" }}
              >
                <table
                  className="table table-bordered "
                  style={{ borderCollapse: "collapse" }}
                >
                  <thead
                  //  style={{ position: "sticky", top: 0, backgroundColor: "#fff", zIndex: 1 }}
                  >
                    <tr style={{ border: "1px solid #dee2e6" }}>
                      <th className="text-center" colspan="2">
                        <h5>{t("Top 5 Loss Events")}</h5>
                      </th>
                    </tr>
                    <tr>
                      <th style={{ width: "65%", border: "1px solid #dee2e6" }}>
                        {t("Loss Event Name")}
                      </th>
                      <th style={{ width: "35%", border: "1px solid #dee2e6" }}>
                        {t("Total Net Loss")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="table-group-divider">
                    {TopLoss.map((item, index) => (
                      <tr key={index}>
                        <td style={{ border: "1px solid #dee2e6" }}>
                          <p className="text-break">{item.event_name}</p>
                        </td>
                        <td style={{ border: "1px solid #dee2e6" }}>
                          {item.total_net_loss}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </Col>
        </Row>
        <Row>
          {privs.includes("LE_LOSS_EVENT_OWNER") && (
            <Col xs={12} md={3} lg={6}>
              <Chart chart="LE_LOSS_BY_DISGTRIBUTION" />
            </Col>
          )}
          {privs.includes("LE_LOSS_EVENT_OWNER") && (
            // <Col xs={12} md={3} lg={6}>
            //   <Chart chart="LE_LOSS_BY_BCG_ONE" />
            // </Col>
            <Col xs={12} md={3} lg={6}>
              <Chart chart="LE_QUARTER_WISE_TREND_CHART" />
            </Col>
          )}
          {privs.includes("LE_LOSS_EVENT_OWNER") && (
            <Col xs={12} md={3} lg={12}>
              <Chart chart="LE_LOSS_BY_BCG_ONE" />
            </Col>

            // <Col xs={12} md={3} lg={12}>
            //   <Chart chart="LE_QUARTER_WISE_TREND_CHART" />
            // </Col>
          )}
        </Row>
      </>
    );
  };

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
        </div>
      </>
    );
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    const offset = 124;
    if (element) {
      const topPos = element.getBoundingClientRect().top - offset;
      window.scrollTo({
        top: window.scrollY + topPos,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <div>
        <LandingPagesTitle
          title={t("Manage Loss Event")}
          configrationForm="lossconfigurationsetup"
          privileges="LE_LOSS_ADMIN"
        />
      </div>

      <nav
        id="navbar-example2"
        className="navbar navbar-light z-1 px-3  d-none"
        style={{ top: "62px" }}
      ></nav>

      <div
        data-bs-spy="scroll"
        data-bs-target="#navbar-example2"
        data-bs-offset="0"
        className="scrollspy-example mt-3"
        tabindex="0"
      >
        <Row id="scrollspyHeading1">
          <FormsandReport />
        </Row>

        <Row>
          {privs.includes("LE_LOSS_EVENT_OWNER") &&
            !privs.includes("LE_VIEWALL_INTERNAL_LOSS_EVENT") && (
              <Col className="p-0 m-0">
                <ReportRuntime report="LE_LOSS_EVENT_INITIATED" dataCard />
              </Col>
            )}
          {privs.includes("LE_VIEWALL_INTERNAL_LOSS_EVENT") && (
            <Col className="p-0 m-0">
              <ReportRuntime report="LE_LOSS_EVENT_INITIATED" dataCard />
            </Col>
          )}
          {privs.includes("LE_VIEWALL_INTERNAL_LOSS_EVENT") && (
            <Col className="p-0 m-0">
              <ReportRuntime report="LE_LOSS_PENDING_FOR_TRIAGE" dataCard />
            </Col>
          )}

          {privs.includes("LE_CREATE_LOSS_EVENT") && (
            <Col className="p-0 m-0">
              <ReportRuntime report="LE_LOSS_EVENT_REGISTER" dataCard />
            </Col>
          )}

          {privs.includes("LE_LOSS_EVENT_OWNER") &&
            !privs.includes("LE_VIEWALL_INTERNAL_LOSS_EVENT") && (
              <Col className="p-0 m-0">
                <ReportRuntime report="LE_HIGH_IMPACTED_LOSS" dataCard />
              </Col>
            )}
          {privs.includes("LE_CREATE_LOSS_EVENT") && (
            <Col className="p-0 m-0">
              <ReportRuntime report="LE_HIGH_IMPACTED_LOSS" dataCard />
            </Col>
          )}

          <Col className="p-0 m-0">
            <ReportRuntime report="LE_ISSUES_BY_LOSS" dataCard />
          </Col>
          <Col className="p-0 m-0">
            <ReportRuntime report="LE_OBSERVATIONS_BY_LOSS" dataCard />
          </Col>
        </Row>

        <Row>
          {privs.includes("LE_LOSS_EVENT_OWNER") && (
            <Col className="p-0 m-0">
              <ReportRuntime report="LE_TOTAL_NET_LOSS" dataCard />
            </Col>
          )}
          {privs.includes("LE_LOSS_EVENT_OWNER") && (
            <Col className="p-0 m-0">
              <ReportRuntime report="LE_TOTAL_RECOVERY" dataCard />
            </Col>
          )}
        </Row>
        <div>
          <Row>
            {privs.includes("LE_CREATE_LOSS_EVENT") && (
              <ReportRuntime report="LE_REPORTED_BY_ME" />
            )}
          </Row>
          <Row>
            {privs.includes("LE_ISSUE_SPECIALIST") && (
              <ReportRuntime report="LE_TRIAGE_INTERNAL_LOSS_EVENT" />
            )}
          </Row>

          <Row>
            {privs.includes("LE_LOSS_EVENT_OWNER") && (
              <ReportRuntime report="LE_MY_INTERNAL_LOSS_EVENTS" />
            )}
          </Row>
          <Row>
            {privs.includes("LE_APPROVE_LOSS_EVENT") && (
              <ReportRuntime report="LE_LOSS_FOR_APPROVAL" />
            )}
          </Row>
        </div>

        <div id="scrollspyHeading2">
          <DataCard />
        </div>

        <div id="scrollspyHeading3">
          <Charts id="charts" />
        </div>
      </div>
    </>
  );
};

export default Default;
