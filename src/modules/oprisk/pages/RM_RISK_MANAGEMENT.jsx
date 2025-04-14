import { Helmet } from "react-helmet-async";
import { Button, Card, Container, Dropdown, Modal } from "react-bootstrap";
import ReportRuntime from "src/components/reports/Report";
import { Row, Col, Tab, Table } from "react-bootstrap";
import { Pie, Bar, Doughnut, Line } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import { getviewData } from "../RiskManagementService";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
  TimeScale,
  plugins,
} from "chart.js";
import * as util from "src/components/forms/reactformutils/elements/formutilfunctions";
import LandingPagesTitle from "src/components/pages/LandingPagesTitle";
import Chart from "src/components/charts/Chart";
import { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faListCheck,
  faPlusCircle,
  faSackDollar,
  faGears,
  faEye,
  faTriangleExclamation,
  faCheckCircle,
  faFileShield,
  faFileCircleCheck,
  faExclamationTriangle,
  faMoneyCheckDollar,
  faFileAlt,
  faArrowTrendUp,
  faArrowUp,
  faArrowsLeftRight,
  faArrowDown,
  faArrowTrendDown,
  faPen,
  faBuilding,
  faClipboardCheck,
  faBuildingColumns,
  faSitemap,
} from "@fortawesome/free-solid-svg-icons";
import { ProgressBar } from "react-bootstrap";
import React from "react";
import axios from "src/utils/AxiosInstance";
import AIGenerate from "./AIGenerate";
import RiskOverview from "./RiskOverview";
import BusinessUnitHierarchy from "./BusinessUnitHierarchy";
import AdminOverview from "./Overview";

const Default = () => {
  let currentUserInfo = {
    logInId: util.getCurrentUser().id,
    privileges: util.getCurrentUser().privileges.split(","),
  };

  const ormHead = currentUserInfo.privileges.includes("RM_RISK_CRO_VIEW");
  const isOrmAdmin = currentUserInfo.privileges.includes("RM_VIEW_ADMIN_SETUP");

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const initialTabs = window.history.state?.activeTab
    ? window.history.state.activeTab
    : ormHead
    ? "RISK_OVERVIEW"
    : isOrmAdmin
    ? "OVERVIEW"
    : "BR_DASHBOARD";

  const [activeTab, setActiveTab] = useState(initialTabs); // Preserve active tab
  const [controlsData, setControlsData] = useState([]);
  const [issueData, setIssueData] = useState([]);
  const [lossData, setLossData] = useState({});
  const [lossEventData, setLossEventData] = useState({});
  const [refreshCharts, setRefreshCharts] = useState(false);

  const navigate = useNavigate();

  const handleClick = (route) => {
    navigate(route);
  };

  const [cardData, setCardData] = useState({
    process_bt: 0,
    risk_bt: 0,
    control_bt: 0,
    testandprocedures_bt: 0,
    compliance_percentage: 0,
    applicable_bu: 0,
    RCSA: 0,
  });

  const handleYearCallback = (year) => {
    setSelectedYear(Number(year)); // Only update year, don't modify tabs
  };

  const handleSelected = (key) => {
    if (key !== null) {
      setActiveTab(key);
      window.history.replaceState({ activeTab: key }, "");
    }
  };
  // const handleYearCallback = (year) => {
  //   setSelectedYear(year); // Only update year, don't modify tabs
  //   console.log(year, typeof year, "year changed");
  // };

  const fetchLossEventData = async () => {
    try {
      const response = await getviewData({
        viewName: "pa_le_top_5_events_v",
        pageNumber: 0,
        pageSize: 0,
        sortField: "",
        sortOrder: "",
        orderExpression: "",
        filterExpression: ``,
      });

      const lossEvents = response.data.data.map((loss) => ({
        lossName: loss?.event_name,
        netLoss: loss?.total_net_loss,
      }));
      setLossEventData(lossEvents);
    } catch (error) {
      console.error("Error fetching loss event data:", error);
    }
  };
  const fetchLossData = async (logInId, year) => {
    const response = await axios.get(
      `/riskmanagement/lossoverview/${logInId}?year=${Number(year)}`
    );
    console.log(response?.data, "loss data");
    setLossData(response?.data);
  };
  const fetchIssueData = async (logInId, year) => {
    const response = await axios.get(
      `/riskmanagement/issueOverView/${logInId}?year=${Number(year)}`
    );
    console.log(response.data, "issue data");
    setIssueData(response.data);
  };
  const fetchControlsData = async (logInId, year) => {
    const response = await axios.get(
      `/riskmanagement/controlTestingOverview/${logInId}?year=${Number(year)}`
    );
    console.log(response.data.controlTestingOverview, "data card response");
    setControlsData(response?.data?.controlTestingOverview);
  };
  const fetchCardData = async (logInId, year) => {
    try {
      const response = await axios.get(
        `/riskmanagement/grcOverview/${logInId}?year=${Number(year)}`
      );
      console.log(response.data, "data card response");

      if (response.data) {
        setCardData({
          process_bt: response.data.process_bt || 0,
          risk_bt: response.data.risk_bt || 0,
          control_bt: response.data.control_bt || 0,
          testandprocedures_bt: response.data.testandprocedures_bt || 0,
          compliance_percentage: response.data.compliance_percentage || 0,
          applicable_bu: response.data.applicable_bu || 0,
          rcsa: response.data.RCSA || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching card data:", error);
    }
  };

  useEffect(() => {
    fetchCardData(currentUserInfo.logInId, selectedYear);
    fetchControlsData(currentUserInfo.logInId, selectedYear);
    fetchIssueData(currentUserInfo.logInId, selectedYear);
    fetchLossData(currentUserInfo.logInId, selectedYear);
    fetchLossEventData();
    setRefreshCharts((prev) => !prev);
  }, [selectedYear]); // Fetch only when year changes

  console.log(controlsData, issueData, "controlsData");

  const cardDataArray = [
    {
      id: 1,
      title: "Process",
      count: `${cardData.process_bt}`,
      api: "process",
      background: "linear-gradient(180deg, #0093E9 0%, #80D0C7 100%)",
      icon: faGears,
      iconColor: "white",
      report: "GL_PROCESS",
    },
    {
      id: 2,
      title: "Risk",
      count: `${cardData.risk_bt}`,
      api: "risk",
      background: "linear-gradient(180deg, #0093E9 0%, #80D0C7 100%)",
      icon: faTriangleExclamation,
      iconColor: "white",
      report: "GL_RISK",
    },
    {
      id: 3,
      title: "Controls",
      count: `${cardData.control_bt}`,
      api: "control",
      background: "linear-gradient(180deg, #0093E9 0%, #80D0C7 100%)",
      icon: faCheckCircle,
      iconColor: "white",
      report: "GL_CONTROL",
    },
    {
      id: 4,
      title: "Test & Procedures",
      count: `${cardData.testandprocedures_bt}`,
      api: "testandprocedures",
      background: "linear-gradient(180deg, #0093E9 0%, #80D0C7 100%)",
      icon: faListCheck,
      iconColor: "white",
      report: "GL_TESTANDPROCEDURES",
    },
    {
      id: 5,
      title: "RCSA",
      //count: `${cardData?.rcsa}`,
      api: "relationship",
      background: "linear-gradient(180deg, #0093E9 0%, #80D0C7 100%)",
      icon: faSitemap,
      iconColor: "white",
      report: "GL_PROCESS_COMPLINACE_FRAMEWORK",
    },
  ];

  const tabs = [
    {
      title: "Overview",
      key: "OVERVIEW",
      privilege: "RM_RISK_MANAGE_PAGE",
    },
    {
      title: ormHead ? "Operational Summary" : "Create/Manage",
      key: "BR_DASHBOARD",
      privilege: "RM_RISK_MANAGE_PAGE",
    },
    {
      title: "Risk Summary",
      key: "RISK_OVERVIEW",
      privilege: "RM_RISK_CRO_VIEW",
    },
    {
      title: "RiskVision AI",
      key: "RISKVISION_AI",
      privilege: "RM_VIEW_BUSINESS_UNITS",
    },
    {
      title: "Applicable Business Units",
      key: "BR_EXERCISE",
      privilege: "RM_VIEW_BUSINESS_UNITS",
    },
    {
      title: "Admin Setup",
      key: "BR_SUMMARY",
      privilege: "RM_VIEW_ADMIN_SETUP",
    },
  ];

  let reorderedTabs = [...tabs];

  // For ORM Head - Risk Overview First
  if (ormHead) {
    const riskOverviewTab = reorderedTabs.find(
      (tab) => tab.key == "RISK_OVERVIEW"
    );
    reorderedTabs = [
      riskOverviewTab,
      ...reorderedTabs.filter((tab) => tab.key !== "RISK_OVERVIEW"),
    ];
  }

  // For ORM Admin - Overview First (Overrides if also ORM Head)
  if (isOrmAdmin) {
    const overviewTab = reorderedTabs.find((tab) => tab.key == "OVERVIEW");
    reorderedTabs = [
      overviewTab,
      ...reorderedTabs.filter((tab) => tab.key !== "OVERVIEW"),
    ];
  }

  return (
    <>
      <Helmet title="Risk Management" />
      <Container fluid className="p-0">
        <div>
          <Tab.Container
            id="menu"
            activeKey={activeTab}
            onSelect={handleSelected}
          >
            <LandingPagesTitle
              title="Risk Management"
              onYearChange={handleYearCallback}
              showYearFilter
              tabs={reorderedTabs}
            />

            <Tab.Content>
              <Tab.Pane eventKey="OVERVIEW">
                <AdminOverview
                  year={selectedYear}
                  refreshCharts={refreshCharts}
                />
              </Tab.Pane>
              <Tab.Pane eventKey="BR_DASHBOARD">
                <BR_DASHBOARD
                  currentUserInfo={currentUserInfo}
                  cardData={cardDataArray}
                  controlsData={controlsData}
                  issueData={issueData}
                  lossData={lossData}
                  lossEventData={lossEventData}
                  handleClick={handleClick}
                  totalTestPercentage={50}
                  year={selectedYear}
                  refreshCharts={refreshCharts}
                />
              </Tab.Pane>
              <Tab.Pane eventKey="BR_EXERCISE">
                <BR_EXERCISE
                  currentUserInfo={currentUserInfo}
                  year={selectedYear}
                  handleClick={handleClick}
                />
              </Tab.Pane>
              <Tab.Pane eventKey="BR_SUMMARY">
                <BR_SUMMARY
                  currentUserInfo={currentUserInfo}
                  handleClick={handleClick}
                />
              </Tab.Pane>
              <Tab.Pane eventKey="RISKVISION_AI" unmountOnExit>
                <AIGenerate />
              </Tab.Pane>
              <Tab.Pane eventKey="RISK_OVERVIEW" unmountOnExit>
                <RiskOverview />
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
      </Container>
    </>
  );
};

ChartJS.register(
  TimeScale,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

const distributeData = (total, months) => {
  const data = Array(months).fill(0);
  let remaining = total;

  while (remaining > 0) {
    const index = Math.floor(Math.random() * months);
    const increment = Math.min(remaining, Math.floor(Math.random() * 10 + 1));
    data[index] += increment;
    remaining -= increment;
  }
  return data;
};

const LineChartExample = ({ issueData }) => {
  console.log(issueData, "issueData");

  const issuesData = distributeData(issueData["Total Issues"], 12);
  const actionsData = distributeData(issueData["Total Actions"], 12);

  const data = {
    labels: [
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
      "Jan",
      "Feb",
      "Mar",
    ],
    datasets: [
      {
        label: "Issues",
        data: issuesData,
        borderColor: "#8884d8",
        backgroundColor: "rgba(136, 132, 216, 0.5)",
        tension: 0.2,
      },
      {
        label: "Actions",
        data: actionsData,
        borderColor: "#82ca9d",
        backgroundColor: "rgba(130, 202, 157, 0.5)",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: "bottom" },
      //tooltip: { mode: "index", intersect: true },
    },
    scales: {
      x: { title: { display: false, text: "Months" } },
      y: { title: { display: false, text: "Count" }, ticks: { stepSize: 10 } },
    },
  };

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Line data={data} options={options} />
    </div>
  );
};

const BusinessUnitTable = ({ totalCountByBu, lossEventData }) => {
  console.log("Loss Events Data:", lossEventData);
  console.log("Total Count by BU:", totalCountByBu);

  const data = totalCountByBu?.length
    ? totalCountByBu
        .filter((item) => item.total_control_count > 1)
        .sort((a, b) => a.total_control_count - b.total_control_count)
    : lossEventData?.length
    ? lossEventData
    : [];

  // Detect currency based on user location or input
  const getCurrencySymbol = (currencyCode) => {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currencyCode,
    })
      .format(0)
      .replace(/\d/g, "")
      .trim();
  };

  const headers = totalCountByBu?.length
    ? ["Business Unit", "#Control"]
    : lossEventData?.length
    ? ["Loss Event Name", `Net Loss (${getCurrencySymbol("INR")})`]
    : [];

  return (
    <div
      style={{
        maxHeight: "320px",
        overflowY: "auto",
        position: "relative",
        scrollbarWidth: "thin",
        scrollbarColor: "#888 transparent",
        marginBottom: "15px",
        border: "1px solid #ddd", // Outer border for table container
      }}
    >
      {data.length > 0 ? (
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead style={{ position: "sticky", top: 0, zIndex: 1 }}>
            <tr
              style={{
                fontSize: "14px",
                color: "#6c757d",
                backgroundColor: "white",
                fontWeight: 600,
                padding: "10px 12px",
                borderTop: "1px solid #dee2e6",
                borderBottom: "1px solid #dee2e6",
                boxShadow: "0 4px 4px -4px rgba(0,0,0,0.1)", // Shadow for sticky effect
              }}
            >
              {headers.map((header, index) => (
                <th
                  key={index}
                  style={{
                    textAlign: "left",
                    padding: "8px",
                    borderLeft: "1px solid #ddd",
                    borderRight: "1px solid #ddd",
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="shadow">
                {totalCountByBu?.length ? (
                  <>
                    <td
                      style={{
                        padding: "6px",
                        textAlign: "left",
                        borderRight: "1px solid #ddd",
                        borderLeft: "1px solid #ddd",
                      }}
                    >
                      {item.business_unit}
                    </td>
                    <td
                      style={{
                        padding: "6px",
                        textAlign: "center",
                      }}
                    >
                      {item.total_control_count}
                    </td>
                  </>
                ) : (
                  <>
                    <td
                      style={{
                        padding: "8px",
                        textAlign: "left",
                        borderRight: "1px solid #ddd",
                        borderLeft: "1px solid #ddd",
                      }}
                    >
                      {item.lossName}
                    </td>
                    <td style={{ padding: "8px", textAlign: "center" }}>
                      {item.netLoss.toLocaleString()}
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ textAlign: "center", padding: "10px" }}>
          No data available
        </p>
      )}
    </div>
  );
};

export const applyHoverEffects = (e, isEntering) => {
  if (isEntering) {
    e.currentTarget.style.position = "relative";
    e.currentTarget.style.transform = "scale(1.04)";
    e.currentTarget.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.1)";
    // e.currentTarget.style.zIndex = "5";
    e.currentTarget.style.border = "1px solid #d3d3d3";
  } else {
    e.currentTarget.style.transform = "scale(1)";
    e.currentTarget.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.1)";
    e.currentTarget.style.zIndex = "1";
    e.currentTarget.style.border = "1px solid #d3d3d3";
  }
};

let BR_DASHBOARD = ({
  currentUserInfo,
  cardData,
  controlsData,
  issueData,
  lossEventData,
  refreshCharts,
  lossData,
  handleClick,
  totalTestPercentage,
  year,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [refreshReports, setRefreshReports] = useState(false);
  const [defaultFilter, setDefaultFilter] = useState({});

  const handleClose = () => {
    setRefreshReports(true);
    setShowModal(false);
    setDefaultFilter({ buId: "", status: "" });
  };
  const handleShow = (reportName, buId, status) => {
    console.log(reportName, "reportName", buId, status);
    setRefreshReports(true);
    setSelectedReport(reportName);
    setShowModal(true);
    setDefaultFilter({ buId: buId, status: status });
  };

  console.log(currentUserInfo, lossData, "current user info");

  const riskCRO = currentUserInfo.privileges.includes("RM_RISK_CRO_VIEW");

  const DataCards = [
    {
      title: "RCM Review",
      icon: faFileShield,
      form: "rcmreview",
      report: "GL_PROCESS_COMPLINACE_FRAMEWORK",
      subtitle: "Initiate",
    },
    {
      title: "KRI",
      icon: faCheck,
      form: "kriLibrary",
      report: "GL_KRI_LIBRARY",
      subtitle: "Initiate",
    },
    {
      title: "Control Testing",
      icon: faCheckCircle,
      form: "triggertest",
      report: "CT_COMPLIANCE_STATUS",
      subtitle: "Initiate",
    },
    {
      title: "Risk Assessment",
      icon: faExclamationTriangle,
      form: "triggerriskassessment",
      report: "RA_LATEST_RISK_REGISTRY",
      subtitle: "Initiate",
    },
    {
      title: "Loss Event",
      icon: faMoneyCheckDollar,
      form: "internallossevent",
      report: "LE_INTERNAL_LOSS_EVENT_ORM",
      subtitle: "Initiate",
    },
    {
      title: "Issue",
      icon: faFileAlt,
      form: "issueregistry",
      report: "IR_ISSUE_DETAILS_ORM",
      subtitle: "Initiate",
    },
  ];

  const riskLevels = [
    { label: "Very High", color: "#ff4545", icon: faArrowTrendUp },
    { label: "High", color: "#ffa534", icon: faArrowUp },
    { label: "Medium", color: "#ffe234", icon: faArrowsLeftRight },
    { label: "Low", color: "#b7dd29", icon: faArrowDown },
    { label: "Very Low", color: "#57e32c", icon: faArrowTrendDown },
  ];

  return (
    <>
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
              //drilldownReports={{ objectId }}
              drilldownReports={{
                status: `'${defaultFilter.status}'`,
                buId: `'${defaultFilter.buId}'`,
              }}
              yearProp={year}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      {!riskCRO && (
        <>
          <Row className="p-0 m-0">
            {cardData.map((card, index) => (
              <Col key={index} className="d-flex p-0 mx-1">
                <Card
                  className="reportChart-cards d-flex flex-column w-100 m-0 p-1"
                  style={{
                    backgroundImage: card.background,
                    borderRadius: "8px",
                    minHeight: "120px",
                    display: "flex",
                    flexGrow: 1,
                  }}
                  // onMouseEnter={(e) => applyHoverEffects(e, true)}
                  // onMouseLeave={(e) => applyHoverEffects(e, false)}
                >
                  <Card.Body className="d-flex flex-column justify-content-between">
                    <Row className="mt-1 d-flex text-white justify-content-between">
                      <Col md={9} className="p-0 m-0">
                        <div>
                          <h4 className="text-white p-0 m-0" title={card.title}>
                            {card.title}
                          </h4>
                          <h4 className="text-white p-0 mt-1">{card.count}</h4>
                        </div>
                      </Col>
                      <Col
                        md={3}
                        className="d-flex align-items-center justify-content-end"
                      >
                        <FontAwesomeIcon
                          icon={card.icon}
                          size="3x"
                          style={{
                            color: card.iconColor,
                            marginRight: "0.5rem",
                          }}
                        />
                      </Col>
                    </Row>
                  </Card.Body>

                  <Card.Footer
                    className="text-white px-1 py-1 m-0"
                    style={{
                      background: card?.background,
                      minHeight: "40px",
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center w-100">
                      <div
                        className="d-flex align-items-center justify-content-evenly px-2"
                        style={{ cursor: "pointer" }}
                        onClick={(e) => {
                          if (e.button === 0) {
                            e.preventDefault();
                            handleClick(
                              `/form/runtime?formService=${card.api}`
                            );
                          }
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faPlusCircle}
                          size="xl"
                          style={{ color: "white" }}
                        />
                        <span className="ms-1">Create</span>
                      </div>

                      <div
                        className="border-start"
                        style={{ height: "30px", color: "#293042" }}
                      ></div>

                      <div
                        className="d-flex align-items-center justify-content-evenly px-2"
                        style={{ cursor: "pointer" }}
                        onClick={(e) => {
                          handleShow(`${card.report}`);
                          // if (e.button === 0) {
                          //   e.preventDefault();
                          //   handleClick(`/report?report=${card.report}`);
                          // }
                        }}
                      >
                        <span className="me-1">View</span>
                        <FontAwesomeIcon
                          icon={faEye}
                          size="xl"
                          style={{ color: "white" }}
                        />
                      </div>
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
          <Row className="p-0 m-0">
            {DataCards?.map(
              ({ title, icon, report, form, subtitle }, index) => (
                <Col
                  key={index}
                  className="px-2 pt-3 pb-2"
                  // style={{ flex: "1 1 46%", minWidth: "150px" }}
                >
                  <Card
                    style={{ minHeight: "60px" }}
                    className="reportChart-cards rounded p-0 m-0 border-0"
                    // onMouseEnter={(e) => applyHoverEffects(e, true)}
                    // onMouseLeave={(e) => applyHoverEffects(e, false)}
                  >
                    <Card.Body className="d-flex p-1 m-0 flex-column align-items-center justify-content-center text-center text-info-emphasis">
                      <FontAwesomeIcon
                        icon={icon}
                        size="3x"
                        style={{ cursor: "pointer" }}
                      />
                      <h6 className="mb-0 pt-1 text-wrap text-dark">{title}</h6>
                    </Card.Body>

                    <Card.Footer className="px-2 py-2 m-0">
                      <div className="d-flex justify-content-between align-items-center text-dark border border-bottom-0 border-start-0 border-end-0 border-top-1">
                        <div
                          className="d-flex justify-content-center align-items-center"
                          style={{ cursor: "pointer" }}
                          onClick={(e) => {
                            if (e.button === 0) {
                              e.preventDefault();
                              handleClick(`/form/runtime?formService=${form}`);
                            }
                          }}
                        >
                          <FontAwesomeIcon icon={faPlusCircle} size="md" />
                          <span className="ms-2">{subtitle}</span>
                        </div>
                        <div
                          className="border-start border-dark"
                          style={{ height: "16px" }}
                        ></div>
                        <div
                          onClick={(e) => {
                            if (e.button === 0) {
                              e.preventDefault();
                              handleClick(`/report?report=${report}`);
                            }
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          <span className="me-2">{"View"}</span>
                          <FontAwesomeIcon icon={faEye} size="md" />
                        </div>
                      </div>
                    </Card.Footer>
                  </Card>
                </Col>
              )
            )}
          </Row>
        </>
      )}

      <Row className="px-2">
        <Col md={6} className="pt-2">
          <Card className="reportChart-cards d-flex flex-column">
            <Card.Header className="text-center h4 py-3">
              Control Testing Overview
            </Card.Header>
            <Card.Body className="d-flex flex-column p-2">
              <Row className="flex-grow-1">
                <Col
                  md={4}
                  className="mb-5"
                  style={{ minWidth: "180px", maxHeight: "250px" }}
                >
                  <Chart
                    chart="CT_CONTROL_REGISTER"
                    yearFlag
                    yearProp={year}
                    key={refreshCharts}
                    customExpressionFlag
                  />
                </Col>
                <Col
                  className="d-flex flex-column mx-2"
                  style={{
                    maxHeight: "320px",
                    overflowY: "auto",
                    position: "relative",
                    scrollbarWidth: "thin",
                    scrollbarColor: "#888 transparent",
                  }}
                >
                  {controlsData?.map((buControls) => {
                    const totalCount = buControls.total_control_count;
                    if (totalCount <= 0) return null;
                    console.log(buControls, "buControls");
                    return (
                      <div key={buControls.business_unit_id} className="mb-3">
                        <p className="mb-1">{buControls.business_unit}</p>
                        <ProgressBar style={{ width: "100%" }}>
                          {[
                            "complied_count",
                            "not_complied_count",
                            "partially_complied_count",
                            "remaining_count",
                          ].map(
                            (status, i) =>
                              buControls[status] > 0 && (
                                <ProgressBar
                                  key={i}
                                  style={{
                                    background: [
                                      "#8ac926",
                                      "#ff595e",
                                      "#ffca3a",
                                      "#e0e0e0",
                                    ][i],
                                  }}
                                  now={(buControls[status] / totalCount) * 100}
                                  label={buControls[status]}
                                  onClick={() =>
                                    handleShow(
                                      "RM_CONTROL_TESTING_STATUS_BY_BU",
                                      buControls?.business_unit_id,
                                      [
                                        "Complied",
                                        "Not Complied",
                                        "Partially Complied",
                                        "Not Assessed",
                                      ][i]
                                    )
                                  }
                                />
                              )
                          )}
                        </ProgressBar>
                      </div>
                    );
                  })}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="pt-2">
          <Card className="reportChart-cards d-flex flex-column">
            <Card.Header className="text-center h4 py-3">
              KRI Overview
            </Card.Header>
            <Card.Body className="d-flex flex-column p-2">
              <Row className="flex-grow-1">
                <Col md={4} style={{ minWidth: "150px", maxHeight: "250px" }}>
                  <Chart
                    chart="GL_KRI_THRESHOLD"
                    yearFlag
                    yearProp={year}
                    key={refreshCharts}
                    customExpressionFlag
                  />
                </Col>
                <Col
                  className="d-flex flex-column mx-2"
                  style={{
                    maxHeight: "320px",
                  }}
                >
                  <Chart
                    chart="GL_RM_KRI_TREND"
                    yearFlag
                    yearProp={year}
                    key={refreshCharts}
                    customExpressionFlag
                  />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="m-0 mt-1 p-0 d-flex justify-content-between align-items-center">
        <Col md={4}>
          <Chart
            chart="RA_RISK_HEAT_MAP_CSR"
            yearFlag
            yearProp={year}
            key={refreshCharts}
            customExpressionFlag
          />
        </Col>

        <Col md={8} className="">
          <Card className="reportChart-cards">
            <Card.Body>
              <h4 className="text-center">Risk Overview</h4>
              <Row className="d-flex justify-content-between align-items-center">
                <Col md={3} className="mb-1">
                  <Chart
                    chart="RA_RISK_REGISTER"
                    yearFlag
                    yearProp={year}
                    key={refreshCharts}
                    customExpressionFlag
                  />
                </Col>

                <Col md={2} className="mb-5">
                  {riskLevels.map(({ label, color, icon }, index) => (
                    <Card
                      key={index}
                      className="mb-1 text-white text-center"
                      style={{ backgroundColor: color, width: "120px" }}
                    >
                      <Card.Body className="p-3 d-flex align-items-center justify-content-center">
                        <FontAwesomeIcon icon={icon} className="me-2" />
                        <h6 className="m-0 text-white">{label}</h6>
                      </Card.Body>
                    </Card>
                  ))}
                </Col>

                <Col md={7} className="">
                  <Chart
                    chart="RA_RATING_BY_MONTH"
                    yearFlag
                    yearProp={year}
                    key={refreshCharts}
                    customExpressionFlag
                  />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="p-0 m-0">
        <Card className="reportChart-cards border border-light-subtle">
          <h4 className="text-center mt-1">Loss Overview</h4>
          <Card.Body className="d-flex justify-content-between align-items-center">
            <Col className="" md={2}>
              <h5 className="text-center">
                {lossData?.[0]?.totalgrossloss || 0}
              </h5>
              <Chart
                chart="LE_GROSS_LOSS"
                yearFlag
                yearProp={year}
                key={refreshCharts}
                processId={currentUserInfo.logInId}
                customExpressionFlag
              />
            </Col>
            <h3>=</h3>
            <Col className="m-1" md={2}>
              <h5 className="text-center">
                {lossData?.[0]?.totalrecoveryloss || 0}
              </h5>
              <Chart
                chart="LE_NET_RECOVERY"
                yearFlag
                yearProp={year}
                key={refreshCharts}
                customExpressionFlag
                processId={currentUserInfo.logInId}
              />
            </Col>
            <h3>+</h3>
            <Col className="m-1" md={2}>
              <h5 className="text-center">
                {lossData?.[0]?.totalnetloss || 0}
              </h5>
              <Chart
                chart="LE_NET_LOSS_CHART"
                yearFlag
                yearProp={year}
                key={refreshCharts}
                customExpressionFlag
                processId={currentUserInfo.logInId}
              />
            </Col>
            <Col className="d-flex justify-content-center align-items-center">
              <div className="" md={6}>
                <BusinessUnitTable lossEventData={lossEventData} />
              </div>
              <Card className="mx-2 p-4 text-primary shadow-0 text-center">
                <div className="my-2">
                  <h6 className="text-primary">Risks</h6>
                  <FontAwesomeIcon
                    size="3x"
                    onClick={() => handleShow("RM_INTERNAL_LOSS_EVENT_RISKS")}
                    icon={faTriangleExclamation}
                  />
                </div>
                <div className="my-2">
                  <h6 className="text-primary">Business Units</h6>
                  <FontAwesomeIcon
                    size="3x"
                    onClick={() =>
                      handleShow("RM_LOSS_EVENT_IMPACTED_BUSINESS_UNITS")
                    }
                    icon={faSitemap}
                  />
                </div>
              </Card>
            </Col>
          </Card.Body>
        </Card>
      </Row>
      <Row className="p-0 m-0 align-items-stretch">
        {/* First Column */}
        <Col md={4} lg={4} className="d-flex">
          <Card className="w-100 reportChart-cards d-flex flex-column">
            <h4 className="text-center mt-2">Issue Overview</h4>
            <Chart
              chart="IR_ISSUE_COUNT"
              Runtimevalue={[
                `${issueData?.["Closed Issues"]} / ${issueData?.["Total Issues"]}`,
                "Closed Issues vs Total Issues",
              ]}
            />
            <Chart
              chart="IR_ACTION_STATUS"
              Runtimevalue={[
                `${issueData?.["Closed Actions"]} / ${issueData?.["Total Actions"]}`,
                "Closed Actions vs Total Actions",
              ]}
            />
          </Card>
        </Col>

        {/* Second Column */}
        <Col md={4} lg={4} className="d-flex">
          <Card className="w-100 reportChart-cards d-flex flex-column">
            <h4 className="text-center mt-2">Issue / Action Trends</h4>
            <Card.Body className="d-flex justify-content-center align-items-center flex-grow-1">
              <LineChartExample issueData={issueData} />
            </Card.Body>
          </Card>
        </Col>

        {/* Third Column */}
        <Col md={4} lg={4} className="d-flex">
          <Card className="w-100 p-0 m-0 reportChart-cards d-flex flex-column">
            <Card.Header className="h4 text-center p-0 m-0 mt-2">
              Issue By Source
              <div className="d-flex justify-content-center align-items-center mt-3">
                <div className="d-flex align-items-center me-3">
                  <span
                    style={{
                      backgroundColor: "#ff595e",
                      width: 40,
                      height: 10,
                      marginRight: 6,
                    }}
                  ></span>
                  <span className="text-secondary fw-light fs-6">High</span>
                </div>
                <div className="d-flex align-items-center me-3">
                  <span
                    style={{
                      backgroundColor: "#ffca3a",
                      width: 40,
                      height: 10,
                      marginRight: 6,
                    }}
                  ></span>
                  <span className="text-secondary fw-light fs-6">Medium</span>
                </div>
                <div className="d-flex align-items-center">
                  <span
                    style={{
                      backgroundColor: "#8ac926",
                      width: 40,
                      height: 10,
                      marginRight: 6,
                    }}
                  ></span>
                  <span className="text-secondary fw-light fs-6">Low</span>
                </div>
              </div>
            </Card.Header>
            <Card.Body className="p-0 m-0 d-flex justify-content-center ">
              <Chart
                chart="IR_ISSUE_BY_SOURCE"
                yearFlag
                yearProp={year}
                key={refreshCharts}
                customExpressionFlag
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

let BR_EXERCISE = ({ currentUserInfo, year, handleClick }) => {
  const [applicableBData, setApplicableBuData] = useState([]);
  const { logInId } = currentUserInfo;

  const fetchBusinessUnitData = async () => {
    try {
      const response = await axios.get(
        `riskmanagement/applicableBusinessUnit/${logInId}?year=${year}`
      );
      console.log(response.data, "business unit data ratings");

      const formattedData = Array.isArray(response.data)
        ? response.data
        : Object.values(response.data);

      setApplicableBuData(formattedData);
    } catch (error) {
      console.error("Error fetching business unit data:", error);
    }
  };

  useEffect(() => {
    fetchBusinessUnitData();
  }, [year]);

  console.log(applicableBData, "applicable business unit data");

  return (
    <>
      <BusinessUnitHierarchy applicableBData={applicableBData} />
    </>
  );
};

let BR_SUMMARY = ({ privs, handleClick }) => {
  return (
    <>
      {/* Admin Setup */}{" "}
      <Row className="p-0 m-0 d-flex justify-content-evenly align-items-circle">
        {[
          {
            title: "GRC Setup",
            icon: faFileShield,
            form: "configurationsetup",
            subtitle: "Initiate",
          },

          {
            title: "Control Testing Setup",
            icon: faCheckCircle,
            form: "complianceconfig",
            subtitle: "Initiate",
          },
          {
            title: "Risk Assessment Setup",
            icon: faExclamationTriangle,
            form: "riskconfig",
            subtitle: "Initiate",
          },
          {
            title: "Loss Event Setup",
            icon: faMoneyCheckDollar,
            form: "lossconfigurationsetup",
            subtitle: "Initiate",
          },
          {
            title: "Issue Setup",
            icon: faFileAlt,
            form: "issueconfigurationsetup",
            subtitle: "Initiate",
          },
        ].map(({ title, icon, form }, index) => (
          <Col key={index} md={2}>
            <Card
              className={`reportChart-cards rounded m-0 mt-1`}
              // onMouseEnter={(e) => applyHoverEffects(e, true)}
              // onMouseLeave={(e) => applyHoverEffects(e, false)}
              style={{ borderRadius: "10px" }}
            >
              <Card.Body
                className="d-flex flex-column align-items-center justify-content-center text-center bg-body-tertiary text-info-emphasis"
                style={{
                  minHeight: "100px",
                  background: "linear-gradient(to top, #dfe9f3 0%, white 100%)",
                }}
              >
                <FontAwesomeIcon
                  icon={icon}
                  size="3x"
                  className="mb-2 linear-gradient(to top, #09203f 0%, #537895 100%)"
                  style={{ cursor: "pointer" }}
                  onClick={(e) => {
                    if (e.button == 0) {
                      e.preventDefault();
                      handleClick(
                        `/form/runtime?formService=${form}&objectId=1`
                      );
                    }
                  }}
                />
                <h6 className="mb-0 text-wrap text-dark">{title}</h6>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default Default;
