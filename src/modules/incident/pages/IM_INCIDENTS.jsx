import { Container } from "react-bootstrap";
import ReportRuntime from "src/components/reports/Report";
import { Row, Col, Card } from "react-bootstrap";
import { useEffect, useState } from "react";
import * as util from "src/components/forms/reactformutils/elements/formutilfunctions";
import FormLink from "src/components/pages/FormLink";
import Chart from "src/components/charts/Chart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import FormReportChartLink from "src/components/pages/FormReportChartLink";
import LandingPagesTitle from "src/components/pages/LandingPagesTitle";

// const ScrollToTop = () => {
//   const [showScrollTopButton, setShowScrollTopButton] = useState(false);

//   const [disformName, setDisformName] = useState(false);
//   useEffect(() => {
//     window.addEventListener("scroll", () => {
//       if (window.scrollY > 300) {
//         setShowScrollTopButton(true);
//       } else {
//         setShowScrollTopButton(false);
//       }
//     });
//   }, []);

//   const scrollTop = () => {
//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     });
//   };
//   return (
//     <div>
//       {showScrollTopButton && (
//         <FontAwesomeIcon
//           icon={faArrowUp}
//           className="top-btn-position  btn-danger  z-2 top-btn-style"
//           onClick={scrollTop}
//         />
//       )}
//     </div>
//   );
// };

const Default = () => {
  let datacard = 0;
  let charts = 0;
  let reports = [
    {
      title: "Business Unit Loss",
      report: "IM_LOSS_BY_BUSINESS_UNIT",
      privilege: "IM_CREATE_INCIDENT",
    },
    {
      title: "Incidents List",
      report: "IM_INCIDENTS",
      privilege: "IM_CREATE_INCIDENT",
    },
    {
      title: "Action Details",
      report: "IR_ACTION_REPORT",
      privilege: "IR_VIEW_ACTIONS",
    },
    {
      title: "Comprehensive Actions",
      report: "IR_COMPREHENSIVE_ACTIONS",
      privilege: "IR_VIEW_ACTIONS",
    },

    {
      title: "Issue Aging",
      report: "IR_ISSUE_AGING",
      privilege: "IR_VIEW_ALL_ISSUE",
    },
  ];

  let forms = [
    {
      title: "Incident",
      form: "imincident",
      privilege: "IM_CREATE_INCIDENT",
    },
  ];

  let chart = [
    // {
    //   title: "Issues By Priority",
    //   chart: "IR_ISSUES_BY_PRIORITY",
    //   privilege: "IR_VIEW_ISSUE",
    // },
    // {
    //   title: "Rejected Issues by source",
    //   chart: "IR_REJECTED_AND_CANCELLED_ISSUES",
    //   privilege: "IR_VIEW_ALL_ISSUE",
    // },
    // {
    //   title: "Actions By Status",
    //   chart: "IR_ACTIONS_BY_STATUS",
    //   privilege: "IR_VIEW_ACTIONS",
    // },
    // {
    //   title: "Rejected Actions",
    //   chart: "IR_REJECTED_AND_CANCELLED_ACTIONS",
    //   privilege: "IR_VIEW_ACTIONS",
    // },
    // {
    //   title: "Actions By Priority",
    //   chart: "IR_ACTIONS_BY_PRIORITY",
    //   privilege: "IR_VIEW_ACTIONS",
    // },
    // {
    //   title: "Actions By Type",
    //   chart: "IR_ACTION_BY_TYPE",
    //   privilege: "IR_VIEW_ACTIONS",
    // },
    // {
    //   title: "Issues by Business Unit",
    //   chart: "ISSUES_BY_BUSINESS_UNIT",
    //   privilege: "IR_VIEW_ALL_ISSUE",
    // },
    // ,
    // {
    //   title: "Actions by Business Unit",
    //   chart: "IR_ACTIONS_BY_BU",
    //   privilege: "IR_VIEW_ALL_ISSUE",
    // },
  ];

  let privs = util.getCurrentUser().privileges?.split(",");
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  checkdataAccess();
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

  const DataCard = () => {
    return (
      <>
        <div>
          {/* <Row>
            {!privs.includes("IR_CREATE_ACTION") &&
              privs.includes("IR_TRIAGE_ISSUE") && (
                <ReportRuntime report="IR_TRIAGE_ISSUE_DATE_CARD" dataCard />
              )}
          </Row> */}

          <Row>
            {(privs.includes("IR_VIEW_ISSUE") ||
              privs.includes("IR_VIEW_ALL_ISSUE")) && (
              <ReportRuntime report="IR_ISSUE_DATA_CARD" dataCard />
            )}
          </Row>
        </div>
      </>
    );
  };

  const Charts = () => {
    return (
      <>
        <div>
          {(privs.includes("IR_VIEW_ALL_ISSUE") ||
            privs.includes("IR_VIEW_ISSUE")) && (
            <div>
              <Row>
                <Col xs={12} md={3} lg={3}>
                  <Chart chart="IR_ISSUES_BY_SEVERITY_RATING" />
                </Col>
                <Col xs={12} md={3} lg={3}>
                  <Chart chart="IR_ISSUES_BY_PROGRAM" />
                </Col>
                <Col xs={12} md={3} lg={3}>
                  <Chart chart="IR_ISSUES_BY_TYPE" />
                </Col>
                <Col xs={12} md={3} lg={3}>
                  <Chart chart="IR_ISSUE_BY_STATUS" />
                </Col>
                {/* <Col xs={12} md={3} lg={3}>
                    <Chart chart="IR_REJECTED_AND_CANCELLED_ISSUES" />
                  </Col> */}
              </Row>
            </div>
          )}

          {/* {privs.includes("IR_VIEW_ALL_ISSUE") && (
            <div>
              <Row>
                <Col xs={12} md={6} lg={8}>
                  <Chart chart="IR_ADMIN_ISSUE_BY_STATUS" />
                </Col>
                <Col xs={12} md={6} lg={4}>
                  <Chart chart="IR_ADMIN_REJECTED_AND_CANCELLED_ISSUES" />
                </Col>
                <Col xs={12} md={6} lg={6}>
                  <Chart chart="IR_ADMIN_ISSUES_BY_PROGRAM" />
                </Col>
                <Col xs={12} md={6} lg={6}>
                  <Chart chart="IR_ADMIN_ISSUES_BY_PRIORITY" />
                </Col>
                <Col xs={12} md={6} lg={6}>
                  <Chart chart="IR_ADMIN_ISSUES_BY_TYPE" />
                </Col>
                <Col xs={12} md={6} lg={6}>
                  <Chart chart="ISSUES_BY_BUSINESS_UNIT" />
                </Col>
              </Row>
            </div>
          )} */}

          {/* {!privs.includes("IR_VIEW_ALL_ACTIONS") &&
            privs.includes("IR_VIEW_ACTIONS") &&
            privs.includes("IR_CREATE_ACTION") && (
              <div>
                <Row>
                  <Col xs={12} md={6} lg={8}>
                    <Chart chart="IR_ACTIONS_BY_STATUS" />
                  </Col>
                  <Col xs={12} md={6} lg={4}>
                    <Chart chart="IR_ACTIONS_BY_PRIORITY" />
                  </Col>
                  <Col xs={12} md={6} lg={4}>
                    <Chart chart="IR_ACTION_BY_TYPE" />
                  </Col>
                  <Col xs={12} md={6} lg={4}>
                    <Chart chart="IR_ACTIONS_BY_BU" />
                  </Col>
                  <Col xs={12} md={6} lg={4}>
                    <Chart chart="IR_REJECTED_AND_CANCELLED_ACTIONS" />
                  </Col>
                </Row>
              </div>
            )}

          {privs.includes("IR_VIEW_ALL_ACTIONS") && (
            <div>
              <Row>
                <Col xs={12} md={6} lg={8}>
                  <Chart chart="IR_ADMIN_ACTIONS_BY_STATUS" />
                </Col>
                <Col xs={12} md={6} lg={4}>
                  <Chart chart="IR_REJECTED_AND_CANCELLED_ACTIONS" />
                </Col>
                <Col xs={12} md={6} lg={6}>
                  <Chart chart="IR_ADMIN_ACTION_BY_TYPE" />
                </Col>
                <Col xs={12} md={6} lg={6}>
                  <Chart chart="IR_ADMIN_ACTIONS_BY_PRIORITY" />
                </Col>
                <Col xs={12} md={6} lg={6}>
                  <Chart chart="ISSUES_BY_BUSINESS_UNIT" />
                </Col>
                <Col xs={12} md={6} lg={6}>
                  <Chart chart="IR_ACTIONS_BY_BU" />
                </Col>
              </Row>
            </div>
          )} */}
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

  function checkdataAccess() {
    // This is for DataCard
    if (
      !privs.includes("IR_CREATE_ACTION") &&
      privs.includes("IR_TRIAGE_ISSUE")
    ) {
      datacard = datacard + 1;
    }

    if (
      privs.includes("IR_CREATE_ACTION") &&
      privs.includes("IR_VIEW_ALL_ISSUE")
    ) {
      datacard = datacard + 1;
    }
    // This is for Chart

    if (
      !privs.includes("IR_VIEW_ALL_ISSUE") &&
      privs.includes("IR_VIEW_ISSUE")
    ) {
      charts = charts + 1;
    }
    if (privs.includes("IR_VIEW_ALL_ISSUE")) {
      charts = charts + 1;
    }
    if (
      !privs.includes("IR_VIEW_ALL_ACTIONS") &&
      privs.includes("IR_VIEW_ACTIONS") &&
      privs.includes("IR_CREATE_ACTION")
    ) {
      charts = charts + 1;
    }

    if (privs.includes("IR_VIEW_ALL_ACTIONS")) {
      charts = charts + 1;
    }
  }
  return (
    <>
      <div>
        <LandingPagesTitle
          title="Manage Incidents"
          configrationForm="issueconfigurationsetup"
          privileges="IR_ISSUE_ADMINISTRATOR"
        />
      </div>
      {/* <ScrollToTop /> */}

      <Row id="scrollspyHeading1">
        <FormsandReport />
      </Row>
      <Row>
        <ReportRuntime report="IM_INCIDENT_SUMMARY" dataCard />
      </Row>
      {/* <Row>
        <Col md={6}>
          <ReportRuntime report="IM_INCIDENTS" />
        </Col>
        <Col md={6}>
          <ReportRuntime report="IM_LOSS_BY_BUSINESS_UNIT" />
        </Col>
      </Row> */}
      <Row>
        <Col md={6}>
          <Chart chart="IM_RISK_RATING"></Chart>
        </Col>
      </Row>
      <Row>
        <Col>
          <Chart chart="IM_INCIDENT_BY_MONTH"></Chart>
        </Col>
      </Row>
      <Row>
        <Col>
          <Chart chart="IM_INCIDENT_BY_BASEL_CATEGORY"></Chart>
        </Col>
        <Col>
          <Chart chart="IM_INCIDENT_BY_BUSINESS_UNIT"></Chart>
        </Col>
      </Row>
    </>
  );
};

export default Default;
