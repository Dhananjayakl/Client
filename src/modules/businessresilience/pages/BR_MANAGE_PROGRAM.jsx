// import { Helmet } from "react-helmet-async";
// import { Container, Modal } from "react-bootstrap";
// import ReportRuntime from "src/components/reports/Report";
// import { Row, Col, Button, Dropdown } from "react-bootstrap";
// import { useEffect } from "react";
// import * as util from "src/components/forms/reactformutils/elements/formutilfunctions";
// import { Card } from "react-bootstrap";
// import LandingPagesTitle from "src/components/pages/LandingPagesTitle";
// import FormReportChartLink from "src/components/pages/FormReportChartLink";
// import Chart from "src/components/charts/Chart";
// import { getBusinessCountByFinancialYear } from "../BRService";
// import { useState } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
// const Default = () => {
//   let privs = util.getCurrentUser().privileges?.split(",");
//   const [businessData, setBusinessData] = useState(null);
//   const [selectedYear, setSelectedYear] = useState("FY2024-2025");
//   const fiscalYears = [
//     "FY2024-2025",
//     "FY2023-2024",
//     "FY2022-2023",
//     "FY2021-2022",
//     "FY2020-2021",
//   ];
//   let userId = JSON.parse(localStorage.current_logged_User)[0].user_details
//     .data[0].user_id;

//   const handleSelect = (year) => {
//     setSelectedYear(year);
//   };

//   const handleNextYear = () => {
//     const currentIndex = fiscalYears.indexOf(selectedYear);
//     if (currentIndex > 0) {
//       setSelectedYear(fiscalYears[currentIndex - 1]);
//     }
//   };

//   const handlePreviousYear = () => {
//     const currentIndex = fiscalYears.indexOf(selectedYear);
//     if (currentIndex < fiscalYears.length - 1) {
//       setSelectedYear(fiscalYears[currentIndex + 1]);
//     }
//   };
//   let forms = [];
//   forms = [
//     {
//       title: "Business Impact Analysis",
//       form: "businessimpactanalysis",
//       privilege: "BR_CREATE_BIA",
//     },
//     {
//       title: "RA and Recovery Strategy",
//       form: "rarecovery",
//       privilege: "BR_PERFORM_RA",
//     },
//     {
//       title: "Business Continuity Plan",
//       form: "businessconplan",
//       privilege: "BR_CREATE_PLAN",
//     },
//     {
//       title: "Exercise",
//       form: "exercisePlan",
//       privilege: "BR_CREATE_EXCERCISE",
//     },
//   ];

//   let reports = [
//     {
//       title: "BIA List Report",
//       report: "BR_BIA_LIST_REPORT",
//       privilege: "BR_VIEW_BIA",
//     },
//     {
//       title: "RA & Recovery Strategy",
//       report: "BR_RA_RECOVERY_STRATEGY",
//       privilege: "BR_VIEW_RA",
//     },
//     {
//       title: "BCP List Report",
//       report: "BR_BCP_LIST_RPT",
//       privilege: "BR_VIEW_BCP",
//     },
//     {
//       title: "Exercise List Report",
//       report: "BR_EXERCISE_LIST_REPORT",
//       privilege: "BR_VIEW_EXERCISE",
//     },
//     {
//       title: "BIA Summary Report",
//       report: "BR_BIA_REPORT",
//       privilege: "BR_VIEW_BIA",
//     },
//   ];
//   let chart = [
//     {
//       title: "Gap Dependency",
//       chart: "BR_DEPENDENCY_GAP_CHART",
//       privilege: "BR_VIEW_EXERCISE",
//     },
//   ];
//   const getFiscalYearRange = (yearStr) => {
//     const [start, end] = yearStr.replace("FY", "").split("-");
//     return { startFY: parseInt(start), endFY: parseInt(end) };
//   };

//   const FormsandReport = () => {
//     const combinedItems = [
//       ...forms.map((item) => ({ ...item, type: "form" })),
//       ...reports.map((item) => ({ ...item, type: "report" })),
//       ...chart.map((item) => ({ ...item, type: "chart" })),
//     ];

//     return (
//       <>
//         <div>
//           <FormReportChartLink combinedItems={combinedItems} />
//         </div>
//       </>
//     );
//   };

// const [objectId, setReportfilter] = useState("");
// const [startYear, setStarttear] = useState("");
// const [endYear, setendYear] = useState("");

// useEffect(() => {
//   const { startFY, endFY } = getFiscalYearRange(selectedYear);
//   getBusinessCountByFinancialYear(
//     "getBusinessDataCount",
//     userId,
//     startFY,
//     endFY
//   ).then((response) => {
//     console.log("egfejk", response.data);
//     setBusinessData(response.data);
//     setStarttear(startFY);
//     setendYear(endFY);
//     if (
//       response.data.businessUnitIds !== undefined &&
//       response.data.businessUnitIds !== "" &&
//       response.data.businessUnitIds !== null &&
//       response.data.businessUnitIds.length > 0
//     ) {
//       setReportfilter(response.data.businessUnitIds);
//     }
//   });
// }, [selectedYear]);

// const [showModal, setShowModal] = useState(false);
// const [selectedReport, setSelectedReport] = useState(null);
// const [refreshReports, setRefreshReports] = useState(false);

// const handleClose = () => {
//   setRefreshReports(true);
//   setShowModal(false);
// };
// const handleShow = (reportName) => {
//   setRefreshReports(true);
//   setSelectedReport(reportName);
//   setShowModal(true);
// };

//   return (
//     <>
//       <Helmet title="Manage BR Program" />
//       <Container fluid className="p-0 ">
//         <div>
//           <LandingPagesTitle title="Manage BR Program" />
//         </div>
//         <div className="row  row-cols-sm-1">
//           <FormsandReport />
//         </div>
//         <Col className="gx-5">
//           <Card className="reportChart-cards">
//             <Col>
//               <div className="float-end my-2 d-inline-flex align-items-center">
//                 <Button className="ml-5" onClick={handlePreviousYear}>
//                   <FontAwesomeIcon icon={faAngleLeft} />
//                 </Button>
//                 <Dropdown className="ms-2 me-2">
//                   <Dropdown.Toggle className="bg-primary">
//                     {selectedYear}
//                   </Dropdown.Toggle>
//                   <Dropdown.Menu>
//                     {fiscalYears.map((year, index) => (
//                       <Dropdown.Item
//                         key={index}
//                         onClick={() => handleSelect(year)}
//                       >
//                         {year}
//                       </Dropdown.Item>
//                     ))}
//                   </Dropdown.Menu>
//                 </Dropdown>
//                 <Button className="ms-0" onClick={handleNextYear}>
//                   <FontAwesomeIcon icon={faAngleRight} />
//                 </Button>
//               </div>
//             </Col>
//             <Card.Body>
//               <div className="row text-center">
//                 <div className="col-md-2 border-end">
//                   <h5>Process</h5>
//                   <div className="display-6">
//                     <span
//                       onClick={() => handleShow("GL_PROCESS_BY_ORG")}
//                       style={{ cursor: "pointer" }}
//                     >
//                       {businessData?.processCount}
//                     </span>
//                     {selectedReport && (
//                       <Modal
//                         show={showModal}
//                         refresh={refreshReports}
//                         onHide={handleClose}
//                         size="xl"
//                       >
//                         <Modal.Header closeButton className="d-none">
//                           <Modal.Title>Report</Modal.Title>
//                         </Modal.Header>
//                         <Modal.Body>
//                           <ReportRuntime
//                             report={selectedReport}
//                             drilldownReports={{ objectId, startYear, endYear }}
//                             yearProp={startYear}
//                           />
//                         </Modal.Body>
//                         <Modal.Footer>
//                           <Button variant="secondary" onClick={handleClose}>
//                             Close
//                           </Button>
//                         </Modal.Footer>
//                       </Modal>
//                     )}
//                   </div>
//                 </div>

//                 <div className="col-md-2 border-end">
//                   <h5>Assets</h5>
//                   <div className="display-6">
//                     {" "}
//                     <span
//                       onClick={() => handleShow("GL_ASSET_BY_ORG")}
//                       style={{ cursor: "pointer" }}
//                     >
//                       {businessData?.assetCount}{" "}
//                     </span>
//                   </div>
//                 </div>
//                 <div className="col-md-2 border-end">
//                   <h5>BIA</h5>
//                   <div className="display-6">
//                     <span
//                       onClick={() => handleShow("BR_BIA_BY_ORG")}
//                       style={{ cursor: "pointer" }}
//                     >
//                       {businessData?.businessImpactAnalysisCount}
//                     </span>
//                   </div>
//                 </div>
//                 <div className="col-md-2 border-end">
//                   <h5>Recovery Strategies</h5>
//                   <div className="display-6">
//                     <span
//                       onClick={() => handleShow("BR_RECOVERY_STRATEGY")}
//                       style={{ cursor: "pointer" }}
//                     >
//                       {businessData?.recoveryStrategyCount}
//                     </span>
//                   </div>
//                 </div>
//                 <div className="col-md-2 border-end">
//                   <h5>BCP</h5>
//                   <div className="display-6">
//                     <span
//                       onClick={() => handleShow("BR_CONTINUITY_PLAN_BY_ORG")}
//                       style={{ cursor: "pointer" }}
//                     >
//                       {businessData?.businessContinuityPlanCount}
//                     </span>
//                   </div>
//                 </div>
//                 <div className="col-md-2">
//                   <h5>Exercises</h5>
//                   <div className="display-6">
//                     <span
//                       onClick={() => handleShow("BR_EXERCISE_PLAN_BY_ORG")}
//                       style={{ cursor: "pointer" }}
//                     >
//                       {businessData?.exercisePlanCount}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>

//         <div className="">
//           {privs.includes("BR_VIEW_EXERCISE") && (
//             <>
//               <div className="pe-0">
//                 <Row id="scrollspyHeading1">
//                   <Col xs={12} md={6} lg={3}>
//                     {" "}
//                     <Chart chart="BR_BIA_COMPLETED_CHART" />
//                   </Col>
//                   <Col xs={12} md={6} lg={3}>
//                     <Chart chart="BR_BCP_COMPLETED_CHART" />
//                   </Col>
//                   <Col xs={12} md={6} lg={3}>
//                     <Chart chart="BR_BCP_PLANS_EXERCISE_CHART" />
//                   </Col>
//                   <Col xs={12} md={6} lg={3}>
//                     <Chart chart="BR_EXERCISE_RECOVERED_CHART" />
//                   </Col>
//                 </Row>
//               </div>
//             </>
//           )}
//           {privs.includes("BR_CREATE_BIA") && (
//             <>
//               <Row>
//                 <ReportRuntime report="BR_MY_BIA_RPT" />
//               </Row>
//             </>
//           )}

//           {privs.includes("BR_VIEW_EXERCISE") && (
//             <>
//               <Row>
//                 <ReportRuntime report="BR_PROCESS_PROGRAM_REP" />
//               </Row>
//               <Row>
//                 <ReportRuntime report="BR_ASSET_PROGRAM_REP" />
//               </Row>

//               <Row>
//                 <ReportRuntime report="BR_ACTIVE_EXCERCISES" />
//               </Row>
//             </>
//           )}
//           {privs.includes("BR_VIEW_BIA") && (
//             <>
//               <div className="pe-0">
//                 <Row id="scrollspyHeading1">
//                   <Col>
//                     <Chart chart="BR_DEPENDENCY_GAP_CHART" />
//                   </Col>
//                   <Col>
//                     <Chart chart="GL_BIA_BUSINESS_CRITICALITY" />
//                   </Col>
//                   <Col>
//                     {" "}
//                     <Chart chart="BR_BIA_BY_STATUS" />
//                   </Col>
//                 </Row>
//               </div>
//             </>
//           )}
//           {privs.includes("BR_VIEW_EXERCISE") && (
//             <>
//               <div className="pe-0">
//                 <Row id="scrollspyHeading1">
//                   <Col>
//                     {" "}
//                     <Chart chart="BR_BC_PLAN_BY_STATUS" />
//                   </Col>
//                   <Col>
//                     {" "}
//                     <Chart chart="BR_PLANS_BY_EXERCISE_RESULTS" />
//                   </Col>
//                   <Col>
//                     {" "}
//                     <Chart chart="BR_PLANS_BY_EXERCISE_STATUS" />
//                   </Col>
//                 </Row>
//               </div>
//               <Row id="scrollspyHeading1">
//                 <Col>
//                   <Chart chart="BR_EXERCISE_BY_STATUS" />
//                 </Col>
//                 <Col>
//                   <Chart chart="IR_BR_ISSUE_BY_STATUS" />
//                 </Col>
//               </Row>
//             </>
//           )}
//         </div>
//       </Container>
//     </>
//   );
// };

// export default Default;

import { Helmet } from "react-helmet-async";
import { Button, Card, Container, Dropdown, Modal } from "react-bootstrap";
import ReportRuntime from "src/components/reports/Report";
import { Row, Col, Tab } from "react-bootstrap";

import * as util from "src/components/forms/reactformutils/elements/formutilfunctions";
import FormLink from "src/components/pages/FormLink";
import LandingPagesTitle from "src/components/pages/LandingPagesTitle";
import FormReportChartLink from "src/components/pages/FormReportChartLink";
import Chart from "src/components/charts/Chart";
import { useEffect, useState } from "react";
import { getBusinessCountByFinancialYear } from "../BRService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisV,
  faGripVertical,
  faInfoCircle,
  faToolbox,
} from "@fortawesome/free-solid-svg-icons";

const Default = () => {
  let privs = util.getCurrentUser().privileges?.split(",");
  let forms = [];
  forms = [
    {
      title: "Business Impact Analysis",
      form: "businessimpactanalysis",
      privilege: "BR_CREATE_BIA",
    },
    {
      title: "RA and Recovery Strategy",
      form: "rarecovery",
      privilege: "BR_PERFORM_RA",
    },
    {
      title: "Business Continuity Plan",
      form: "businessconplan",
      privilege: "BR_CREATE_PLAN",
    },
    {
      title: "Exercise",
      form: "exercisePlan",
      privilege: "BR_CREATE_EXCERCISE",
    },
  ];

  let reports = [
    {
      title: "BIA List Report",
      report: "BR_BIA_LIST_REPORT",
      privilege: "BR_VIEW_BIA",
    },
    {
      title: "RA & Recovery Strategy",
      report: "BR_RA_RECOVERY_STRATEGY",
      privilege: "BR_VIEW_RA",
    },
    {
      title: "BCP List Report",
      report: "BR_BCP_LIST_RPT",
      privilege: "BR_VIEW_BCP",
    },
    {
      title: "Exercise List Report",
      report: "BR_EXERCISE_LIST_REPORT",
      privilege: "BR_VIEW_EXERCISE",
    },
    {
      title: "BIA Summary Report",
      report: "BR_BIA_REPORT",
      privilege: "BR_VIEW_BIA",
    },
  ];
  let chart = [
    {
      title: "Gap Dependency",
      chart: "BR_DEPENDENCY_GAP_CHART",
      privilege: "BR_VIEW_EXERCISE",
    },
  ];
  let [yearProp, setYearProp] = useState(new Date().getFullYear());

  const handleYearCallback = (year) => {
    setYearProp(year);
  };

  //Avoid Tab navigation OnReload Start
  const initialTab = window.history.state?.activeTab || "BR_DASHBOARD";
  const [activeTab, setActiveTab] = useState(initialTab);
  const handleSelect = (key) => {
    if (key !== null) {
      setActiveTab(key);
      window.history.replaceState({ activeTab: key }, "");
    }
  };

  return (
    <>
      <Helmet title="Manage BR Program" />
      <Container fluid className="p-0 ">
        <Card
          className="w-25"
          style={{
            backgroundColor: "#d35400",
            color: "white",
            // padding: "10px",
            borderRadius: "8px",
          }}
        >
          <Card.Body>
            <Row className="align-items-center ">
              {/* Icon */}
              <Col xs="auto" className="d-flex align-items-center">
                <div>
                  <FontAwesomeIcon icon={faGripVertical} size="lg" />
                </div>
              </Col>

              {/* Text */}
              <Col
                className="text-center  "
                xa="auto"
                // style={{ fontSize: "16px", fontWeight: "bold" }}
              >
                Plans Updated Overdue
              </Col>

              {/* Number */}
              <Col className="d-flex ">
                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{
                    width: "30px",
                    height: "30px",
                    minWidth: "30px",
                    borderRadius: "50%",
                    backgroundColor: "lightgray",
                    // fontSize: "18px",
                    // fontWeight: "bold",
                    color: "black",
                  }}
                >
                  0
                </div>
              </Col>
              <Col className="">
                {/* /   <div> */}
                <FontAwesomeIcon icon={faInfoCircle} size="lg" />
                {/* </div>/ */}
              </Col>
              <Col className="">
                <FontAwesomeIcon icon={faEllipsisV} size="lg" />
              </Col>
            </Row>
          </Card.Body>
        </Card>
        <div>
          <Tab.Container
            id="menu"
            activeKey={activeTab}
            onSelect={handleSelect}
          >
            <LandingPagesTitle
              title="Manage BR Program"
              showYearFilter
              // configurationForm="biaconfigurationsetup"
              // privileges="BR_SETUP_BR"
              tabs={[
                {
                  title: "Dashboard",
                  key: "BR_DASHBOARD",
                  privilege: "BR_VIEW_BCP",
                },
                // {
                //   title: "Timeline",
                //   key: "BR_TIMELINE",
                //   privilege: "BR_VIEW_BCP",
                // },
                {
                  title: "Exercises",
                  key: "BR_EXERCISE",
                  privilege: "BR_VIEW_BCP",
                },
                {
                  title: "Summary",
                  key: "BR_SUMMARY",
                  privilege: "BR_VIEW_BCP",
                },
              ]}
              onYearChange={handleYearCallback}
            />

            <Tab.Content>
              <Tab.Pane eventKey="BR_DASHBOARD" unmountOnExit>
                <BR_DASHBOARD
                  privs={privs}
                  forms={forms}
                  reports={reports}
                  chart={chart}
                  yearProp={yearProp}
                />
              </Tab.Pane>

              {/* <Tab.Pane eventKey="BR_TIMELINE" unmountOnExit>
                <BR_TIMELINE privs={privs} />
              </Tab.Pane> */}

              <Tab.Pane eventKey="BR_EXERCISE" unmountOnExit>
                <BR_EXERCISE privs={privs} yearProp={yearProp} />
              </Tab.Pane>
              <Tab.Pane eventKey="BR_SUMMARY" unmountOnExit>
                <BR_SUMMARY privs={privs} yearProp={yearProp} />
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
      </Container>
    </>
  );
};

let BR_DASHBOARD = ({ privs, forms, reports, chart, yearProp }) => {
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
  const [businessData, setBusinessData] = useState(null);

  let userId = JSON.parse(localStorage.current_logged_User)[0].user_details
    .data[0].user_id;

  const [objectId, setReportfilter] = useState("");

  useEffect(() => {
    // const { startFY, endFY } = getFiscalYearRange(selectedYear);
    getBusinessCountByFinancialYear(
      "getBusinessDataCount",
      userId,
      yearProp
      // startFY,
      // endFY
    ).then((response) => {
      setBusinessData(response.data);

      if (
        response.data.businessUnitIds !== undefined &&
        response.data.businessUnitIds !== "" &&
        response.data.businessUnitIds !== null &&
        response.data.businessUnitIds.length > 0
      ) {
        setReportfilter(response.data.businessUnitIds);
      }
    });
  }, [yearProp]);

  const [showModal, setShowModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [refreshReports, setRefreshReports] = useState(false);

  const handleClose = () => {
    setRefreshReports(true);
    setShowModal(false);
  };
  const handleShow = (reportName) => {
    setRefreshReports(true);
    setSelectedReport(reportName);
    setShowModal(true);
  };

  return (
    <>
      <div className="row  row-cols-sm-1">
        <FormsandReport />
      </div>

      <Col className="gx-5">
        <Card className="reportChart-cards">
          <Card.Body>
            {" "}
            <div className="row text-center">
              <div className="col-md-2 border-end">
                <h5>Process</h5>
                <div className="display-6">
                  {/* <span
                       // onClick={() => handleShow("GL_PROCESS_BY_BU")}
                       style={{ cursor: "pointer" }}
                    > */}
                  <span
                    onClick={() => handleShow("GL_PROCESS_BY_ORG")}
                    style={{ cursor: "pointer" }}
                  >
                    {businessData?.processCount}
                  </span>
                  {/* </span> */}
                  {selectedReport && (
                    <Modal
                      show={showModal}
                      refresh={refreshReports}
                      onHide={handleClose}
                      size="xl"
                    >
                      <Modal.Header closeButton className="d-none">
                        <Modal.Title>Report</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <ReportRuntime
                          report={selectedReport}
                          drilldownReports={{ objectId }}
                          yearProp={yearProp}
                        />
                      </Modal.Body>
                      <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                          Close
                        </Button>
                      </Modal.Footer>
                    </Modal>
                  )}
                  {/* </span> */}
                </div>
              </div>

              <div className="col-md-2 border-end">
                <h5>Assets</h5>
                <div className="display-6">
                  {" "}
                  <span
                    onClick={() => handleShow("GL_ASSET_BY_ORG")}
                    style={{ cursor: "pointer" }}
                  >
                    {businessData?.assetCount}{" "}
                  </span>
                </div>
              </div>
              <div className="col-md-2 border-end">
                <h5>BIA</h5>
                <div className="display-6">
                  <span
                    onClick={() => handleShow("BR_BIA_BY_ORG")}
                    style={{ cursor: "pointer" }}
                  >
                    {businessData?.businessImpactAnalysisCount}
                  </span>
                </div>
              </div>
              <div className="col-md-2 border-end">
                <h5>Recovery Strategies</h5>
                <div className="display-6">
                  <span
                    onClick={() => handleShow("BR_RECOVERY_STRATEGY")}
                    style={{ cursor: "pointer" }}
                  >
                    {businessData?.recoveryStrategyCount}
                  </span>
                </div>
              </div>
              <div className="col-md-2 border-end">
                <h5>BCP</h5>
                <div className="display-6">
                  <span
                    onClick={() => handleShow("BR_CONTINUITY_PLAN_BY_ORG")}
                    style={{ cursor: "pointer" }}
                  >
                    {businessData?.businessContinuityPlanCount}
                  </span>
                </div>
              </div>
              <div className="col-md-2">
                <h5>Exercises</h5>
                <div className="display-6">
                  <span
                    onClick={() => handleShow("BR_EXERCISE_PLAN_BY_ORG")}
                    style={{ cursor: "pointer" }}
                  >
                    {businessData?.exercisePlanCount}
                  </span>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
      {privs.includes("BR_VIEW_EXERCISE") && (
        <>
          <div className="pe-0">
            <Row id="scrollspyHeading1">
              <Col xs={12} md={6} lg={3}>
                {" "}
                <Chart
                  chart="BR_BIA_COMPLETED_CHART"
                  yearProp={yearProp}
                  yearFlag
                  customExpressionFlag
                />
              </Col>
              <Col xs={12} md={6} lg={3}>
                <Chart
                  chart="BR_BCP_COMPLETED_CHART"
                  yearProp={yearProp}
                  yearFlag
                  customExpressionFlag
                />
              </Col>
              <Col xs={12} md={6} lg={3}>
                <Chart
                  chart="BR_BCP_PLANS_EXERCISE_CHART"
                  yearProp={yearProp}
                  yearFlag
                  customExpressionFlag
                />
              </Col>
              <Col xs={12} md={6} lg={3}>
                <Chart
                  chart="BR_EXERCISE_RECOVERED_CHART"
                  yearProp={yearProp}
                  yearFlag
                  customExpressionFlag
                />
              </Col>
            </Row>
          </div>
        </>
      )}
      {privs.includes("BR_CREATE_BIA") && (
        <>
          <Row>
            <ReportRuntime report="BR_MY_BIA_RPT" yearProp={yearProp} />
          </Row>
        </>
      )}
      {privs.includes("BR_VIEW_BIA") && (
        <>
          <div className="pe-0">
            <Row id="scrollspyHeading1">
              <Col>
                <Chart
                  chart="BR_DEPENDENCY_GAP_CHART"
                  yearFlag
                  yearProp={yearProp}
                  customExpressionFlag
                />
              </Col>
              <Col>
                <Chart
                  chart="GL_BIA_BUSINESS_CRITICALITY"
                  yearProp={yearProp}
                  yearFlag
                  customExpressionFlag
                />{" "}
              </Col>
              <Col>
                {" "}
                <Chart
                  chart="BR_BIA_BY_STATUS"
                  yearProp={yearProp}
                  yearFlag
                  customExpressionFlag
                />
              </Col>
            </Row>
          </div>
        </>
      )}
      {privs.includes("BR_VIEW_EXERCISE") && (
        <>
          <div className="pe-0">
            <Row id="scrollspyHeading1">
              <Col>
                <Chart
                  chart="BR_BC_PLAN_BY_STATUS"
                  yearProp={yearProp}
                  yearFlag
                  customExpressionFlag
                />
              </Col>
              <Col>
                {" "}
                <Chart
                  chart="BR_PLANS_BY_EXERCISE_RESULTS"
                  yearProp={yearProp}
                  yearFlag
                  customExpressionFlag
                />
              </Col>
              <Col>
                {" "}
                <Chart
                  chart="BR_PLANS_BY_EXERCISE_STATUS"
                  yearProp={yearProp}
                  yearFlag
                  customExpressionFlag
                />
              </Col>

              {/* <Col>
                  <Chart chart="BR_RA_BY_STATUS" />
                </Col> */}
            </Row>
          </div>
          <Row id="scrollspyHeading1">
            <Col>
              <Chart
                chart="BR_EXERCISE_BY_STATUS"
                yearProp={yearProp}
                yearFlag
                customExpressionFlag
              />
            </Col>
            <Col>
              <Chart
                chart="IR_BR_ISSUE_BY_STATUS"
                yearProp={yearProp}
                yearFlag
                customExpressionFlag
              />
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

let BR_TIMELINE = () => {};
let BR_EXERCISE = ({ privs, yearProp }) => {
  return (
    <div className="">
      {privs.includes("BR_VIEW_EXERCISE") && (
        <>
          <Row>
            <ReportRuntime
              report="BR_ACTIVE_EXCERCISES"
              yearProp={yearProp}
              yearFlag
              customExpressionFlag
            />
          </Row>
          <Row id="scrollspyHeading1" className="ms-1 me-1">
            {/* <Chart chart="BR_EXERCISE_BY_DATE" /> */}
          </Row>
        </>
      )}
    </div>
  );
};

let BR_SUMMARY = ({ privs, yearProp }) => {
  return (
    <div className="">
      {privs.includes("BR_VIEW_EXERCISE") && (
        <>
          <Row>
            <ReportRuntime
              report="BR_PROCESS_PROGRAM_REP"
              yearProp={yearProp}
            />
          </Row>
          <Row>
            <ReportRuntime report="BR_ASSET_PROGRAM_REP" yearProp={yearProp} />
          </Row>
        </>
      )}
    </div>
  );
};

export default Default;
