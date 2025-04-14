import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
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
  Table,
  ListGroup,
} from "react-bootstrap";
import { getObjects, getTrensRiskData, getviewData } from "../GrcService";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
// Register required components with ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

import {
  Minus,
  TrendingDown,
  TrendingUp,
  GitCommit,
  AlertTriangle,
  Check,
  DollarSign,
  ChevronsRight,
  XCircle,
} from "react-feather";
import Chart from "src/components/charts/Chart";
//import "@fortawesome/fontawesome-free/css/all.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReportRuntime from "src/components/reports/Report";
import Tree from "src/components/pages/Tree";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import {
  faFilePdf,
  faArrowsSpin,
  faTriangleExclamation,
  faCheckToSlot,
  faComments,
  faBuilding,
  faBriefcase,
  faBookBookmark,
  faTimes,
  faHome,
  faGaugeHigh,
} from "@fortawesome/free-solid-svg-icons";
import { PageBreadCrumb, PageBreadCrumbItem } from "./PageUtils";
import { useTranslation } from "react-i18next";

const Default = () => {
 
  const [searchParams] = useSearchParams();
  const objectId = searchParams.get("objectId");
  const [dynamicRating, setDynamicRating] = useState();
  const [krilibrarydata, setKrilibrarydata] = useState(null);
  const [riskdata, setRiskdata] = useState(null);
  const [showCard, setShowCard] = useState(false);
  const [activePopup, setActivePopup] = useState(null);
  const [isBlurred, setIsBlurred] = useState(false);
  const { t } = useTranslation("common");
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    getTrensRiskData("AverageRiskTrend", objectId).then((response) => {
      const data = response.data;
      const colors = [
        "rgba(255, 99, 132, 1)", // Red
        "rgba(75, 192, 192, 1)", // Green
        "rgba(54, 162, 235, 1)", // Blue
        "rgba(255, 206, 86, 1)", // Yellow
        "rgba(153, 102, 255, 1)", // Purple
        "rgba(255, 159, 64, 1)", // Orange
      ];

      const backgroundColors = colors.map((color) =>
        color.replace("1)", "0.2)")
      ); // Adjusting for transparency

      const formattedData = {
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
        datasets: Object.keys(data).map((year, index) => ({
          label: `${year}`,
          data: Object.values(data[year]),
          borderColor: colors[index % colors.length],
          backgroundColor: backgroundColors[index % backgroundColors.length],
          tension: 0.4,
        })),
      };

      setChartData(formattedData);
    });
  }, [objectId]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "KRI Trends",
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        title: {
          display: true,
          text: "Month",
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          display: true,
        },
        title: {
          display: true,
          text: "Average Risk",
        },
      },
    },
  };

  const handleIconClick = (popupType) => {
    setActivePopup(popupType);
    setIsBlurred(true);
  };

  const closePopup = () => {
    setActivePopup(null);
    setIsBlurred(false);
  };

  const toggleCard = () => {
    setShowCard(!showCard);
  };

  const stats = [
    { id: 1, name: "Transactions every 24 hours", value: "44 million" },
    { id: 2, name: "Assets under holding", value: "$119 trillion" },
    { id: 3, name: "New users annually", value: "46,000" },
  ];

  // Fetch Risk Rating library data
  // const fetchDynamicRating = () => {
  //   getviewData({
  //     viewName: "pa_ra_risk_dynamic_rating_v",
  //     pageNumber: 0,
  //     pageSize: 0,
  //     sortField: "",
  //     sortOrder: "",
  //     orderExpression: "",
  //     filterExpression: `risk_id=${objectId}`,
  //   })
  //     .then((response) => {
  //       setDynamicRating(response.data?.data);
  //       console.log("fffffffff", response.data?.data);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getviewData({
          viewName: "pa_ra_risk_dynamic_rating_v",
          pageNumber: 0,
          pageSize: 0,
          sortField: "",
          sortOrder: "",
          orderExpression: "",
          filterExpression: `risk_id=${objectId}`,
        });

        if (response.data.data.length !== 0) {
          setDynamicRating(response.data.data[0]);
        }
      } catch (error) {}
    };

    fetchData();
  }, [objectId]);

  const fetchkrilibraryData = () => {
    getviewData({
      viewName: "pa_gl_rcsa_bv",
      pageNumber: 0,
      pageSize: 0,
      sortField: "",
      sortOrder: "",
      orderExpression: "",
      filterExpression: `risk_id=${objectId}`,
    })
      .then((response) => {
        setKrilibrarydata(response.data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchRiskData = () => {
    getviewData({
      viewName: "pa_gl_risk_bt",
      pageNumber: 0,
      pageSize: 0,
      sortField: "",
      sortOrder: "",
      orderExpression: "",
      filterExpression: `object_id=${objectId}`,
    })
      .then((response) => {
        setRiskdata(response.data.data[0]);
        console.log("Rahulllllll,", response.data.data[0]);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const renderProcessItems = () => {
    if (!krilibrarydata || !Array.isArray(krilibrarydata)) return <div>--</div>;

    const uniqueProcessNames = new Set();

    const processItems = krilibrarydata
      .map(({ d_process_name }, index) => {
        if (!d_process_name || uniqueProcessNames.has(d_process_name.trim()))
          return null;
        uniqueProcessNames.add(d_process_name.trim());
        return (
          <div key={index}>
            <ul>
              <li>{d_process_name.trim()}</li>
            </ul>
          </div>
        );
      })
      .filter(Boolean);

    return processItems.length > 0 ? (
      processItems
    ) : (
      <ul>
        <li>
          <div>--</div>
        </li>
      </ul>
    );
  };

  const renderControlItems = () => {
    if (!krilibrarydata || !Array.isArray(krilibrarydata)) return <div>--</div>;

    const uniqueControlNames = new Set();

    const controlItems = krilibrarydata
      .map(({ d_control_name }, index) => {
        if (!d_control_name || uniqueControlNames.has(d_control_name.trim()))
          return null;
        uniqueControlNames.add(d_control_name.trim());
        return (
          <div key={index}>
            <ul>
              <li>{d_control_name.trim()}</li>
            </ul>
          </div>
        );
      })
      .filter(Boolean);

    return controlItems.length > 0 ? (
      controlItems
    ) : (
      <ul>
        <li>
          <div>--</div>
        </li>
      </ul>
    );
  };

  const renderBusinessUnits = () => {
    if (!krilibrarydata || !Array.isArray(krilibrarydata)) return <div>--</div>;

    const uniqueBusinessUnits = new Set();

    const businessUnitItems = krilibrarydata
      .map(({ d_business_unit }, index) => {
        if (!d_business_unit || uniqueBusinessUnits.has(d_business_unit.trim()))
          return null;
        uniqueBusinessUnits.add(d_business_unit.trim());
        return (
          <div key={index}>
            <ul>
              <li>{d_business_unit.trim()}</li>
            </ul>
          </div>
        );
      })
      .filter(Boolean);

    return businessUnitItems.length > 0 ? (
      businessUnitItems
    ) : (
      <ul>
        <li>
          <div>--</div>
        </li>
      </ul>
    );
  };

  useEffect(() => {
    fetchkrilibraryData();
    fetchRiskData();
  }, [objectId]);

  return (
    <div>
      <Container fluid className="p-3">
        <div className="shadow sticky-top bg-white z-1">
          <PageBreadCrumb>
            <PageBreadCrumbItem title={t("Risk Environment")} />
            <PageBreadCrumbItem title={riskdata?.name} />
          </PageBreadCrumb>
          <Card className="sticky-top px-2 py-1 mb-3" style={{ zIndex: "2" }}>
            <Row>
              <Col lg={8}>
                <div className="h4 overflow-hidden ">
                  <FontAwesomeIcon icon={faTriangleExclamation} />{" "}
                  {riskdata?.name}
                </div>
              </Col>
              {/* <Col>
                <div className="float-end">
                  <span
                    className={`ms-1 rounded-circle  align-items-center justify-content-center`}
                  >
                    <FontAwesomeIcon
                      icon={faFilePdf}
                      size="lg"
                      className="text-black"
                    />
                    <i className="bi bi-file-earmark-pdf-fill"></i>
                  </span>
                </div>
              </Col> */}
            </Row>
          </Card>
        </div>

        <Row className="gx-5">
          <Col md={6}>
            <Row>
              <ReportRuntime
                report="GL_RISK_BY_ID"
                drilldownReports={{ objectId: objectId }}
              />
            </Row>
          </Col>
          <Col md={6}>
            <Row>
              <Row>
                <Col className="pt-0">
                  <Card class="reportChart-cards">
                    <div class="p-1 ps-2 pe-2 m-0 card-body">
                      <Row className="pb-2">
                        <Col>
                          <h2 class="card-title">{t("Dynamic")}</h2>
                        </Col>
                        <Col className=" col-auto">
                          <ChevronsRight color="Blue" size={25} />
                        </Col>
                      </Row>
                      {/* <h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6> */}
                      <Row className="pb-2">
                        <h4 class="card-text">
                          {dynamicRating
                            ? dynamicRating.dynamic_risk_rating
                            : "--"}
                        </h4>
                      </Row>
                    </div>
                  </Card>
                </Col>
                <Col className="pt-0">
                  <Card class="reportChart-cards">
                    <div class=" p-1 ps-2 pe-2 m-0 card-body">
                      <Row className="pb-2">
                        <Col>
                          <h2 class="card-title">{t("Risk")}</h2>
                        </Col>
                        <Col className="col-auto">
                          <AlertTriangle color="Blue" size={25} />
                        </Col>
                      </Row>
                      {/* <h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6> */}
                      <Row className="pb-2">
                        <h4 class="card-text">
                          {dynamicRating ? dynamicRating.risk_rating : "--"}
                        </h4>
                      </Row>
                    </div>
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col className="pt-0">
                  <Card class="reportChart-cards">
                    <div class="p-1 ps-2 pe-2 m-0  card-body">
                      <Row className="pb-2">
                        <Col>
                          <h2 class="card-title">{t("KRI")}</h2>
                        </Col>
                        <Col className="col-auto">
                          <Check color="Blue" size={25} />
                        </Col>
                      </Row>
                      {/* <h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6> */}
                      <Row className="pb-2">
                        <h4 class="card-text">
                          {dynamicRating ? dynamicRating.kri_threshold : "--"}
                        </h4>
                      </Row>
                    </div>
                  </Card>
                </Col>
                <Col className="pt-0">
                  <Card class="reportChart-cards">
                    <div class="p-1 ps-2 pe-2 m-0 card-body">
                      <Row className="pb-2">
                        <Col>
                          <h2 class="card-title">{t("Loss")}</h2>
                        </Col>
                        <Col className="col-auto">
                          <DollarSign color="Blue" size={25} />
                        </Col>
                      </Row>
                      {/* <h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6> */}
                      <Row className="pb-2">
                        <h4 class="card-text">
                          {" "}
                          {dynamicRating ? dynamicRating.loss_rating : "--"}
                        </h4>
                      </Row>
                    </div>
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col className="pt-0">
                  <Card class="reportChart-cards">
                    <div class="p-1 ps-2 pe-2 m-0 card-body">
                      <Row className="pb-1">
                        <Col>
                          <h2 class="card-title">{t("Issue")}</h2>
                        </Col>
                        <Col className="col-auto">
                          <XCircle color="Blue" size={25} />
                        </Col>
                      </Row>
                      {/* <h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6> */}
                      <Row className="pb-2">
                        <h4 class="card-text">
                          {" "}
                          {dynamicRating ? dynamicRating.issue_rating : "--"}
                        </h4>
                      </Row>
                    </div>
                  </Card>
                </Col>
                <Col className="pt-0"></Col>
              </Row>
            </Row>

            {/* </Col>
             <Col md={6}> */}
            <Row className="text-center align-items-center d-flex justify-content-center pt-0">
              <Col md={3} className="d-flex justify-content-center">
                <h4>{t("Relationship")}</h4>
              </Col>
              <Col md={9} className="d-flex align-items-center">
                <hr style={{ width: "100%" }} />
              </Col>
            </Row>
            <Row className="mt-2 d-flex justify-content-around align-items-stretch">
              <Col md={4} className="d-flex">
                <Card
                  className="gx-5 flex-grow-1"
                  style={{
                    border: "1px solid #ddd",
                    padding: "10px",
                    textAlign: "center",
                    borderRadius: "8px",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                    flexGrow: 1,
                  }}
                >
                  <h5>{t("Business Unit(s)")}</h5>
                  <FontAwesomeIcon
                    icon={faBuilding}
                    style={{
                      cursor: "pointer",
                      fontSize: "24px",
                      color: "#007bff",
                    }}
                    onClick={() => handleIconClick("business")}
                  />
                  {activePopup === "business" && (
                    <>
                      <div
                        style={{
                          position: "fixed",
                          top: "0",
                          left: "0",
                          width: "100%",
                          height: "100%",
                          backgroundColor: "rgba(0, 0, 0, 0.3)", // Semi-transparent background
                          backdropFilter: "blur(5px)", // Blur effect
                          zIndex: 2,
                        }}
                      />
                      <div
                        style={{
                          position: "fixed",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          width: "400px",
                          padding: "40px",
                          backgroundColor: "#fff",
                          border: "1px solid #ddd",
                          borderRadius: "8px",
                          zIndex: 2,
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faTimes}
                          className="position-absolute text-primary"
                          style={{
                            top: "15px",
                            right: "15px",
                            cursor: "pointer",
                            fontSize: "20px",
                          }}
                          onClick={closePopup}
                        />
                        <h4
                          style={{
                            textAlign: "center",
                            marginBottom: "20px",
                            color: "#007bff",
                          }}
                        >
                          {t("Related Business Unit(s)")}
                        </h4>
                        <div
                          style={{
                            textAlign: "left",
                            marginTop: "20px",
                            maxHeight: "40vh",
                            overflowY: "auto",
                          }}
                        >
                          {renderBusinessUnits()}
                        </div>
                      </div>
                    </>
                  )}
                </Card>
              </Col>

              <Col md={4} className="d-flex">
                <Card
                  className="gx-5 flex-grow-1"
                  style={{
                    border: "1px solid #ddd",
                    padding: "10px",
                    textAlign: "center",
                    borderRadius: "8px",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                    flexGrow: 1,
                  }}
                >
                  <h5>{t("Process")}</h5>
                  <FontAwesomeIcon
                    icon={faArrowsSpin}
                    style={{
                      cursor: "pointer",
                      fontSize: "24px",
                      color: "#007bff",
                    }}
                    onClick={() => handleIconClick("process")}
                  />
                  {activePopup === "process" && (
                    <>
                      <div
                        style={{
                          position: "fixed",
                          top: "0",
                          left: "0",
                          width: "100%",
                          height: "100%",
                          backgroundColor: "rgba(0, 0, 0, 0.3)", // Semi-transparent background
                          backdropFilter: "blur(5px)", // Blur effect
                          zIndex: 2,
                        }}
                      />
                      <div
                        style={{
                          position: "fixed",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          width: "400px",
                          padding: "40px",
                          backgroundColor: "#fff",
                          border: "1px solid #ddd",
                          borderRadius: "8px",
                          zIndex: 2,
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faTimes}
                          className="position-absolute text-primary"
                          style={{
                            top: "15px",
                            right: "15px",
                            cursor: "pointer",
                            fontSize: "20px",
                          }}
                          onClick={closePopup}
                        />
                        <h4
                          style={{
                            textAlign: "center",
                            marginBottom: "20px",
                            color: "#007bff",
                          }}
                        >
                           {t("Related Process")}
                        </h4>
                        <div
                          style={{
                            textAlign: "left",
                            marginTop: "20px",
                            maxHeight: "40vh",
                            overflowY: "auto",
                          }}
                        >
                          {renderProcessItems()}
                        </div>
                      </div>
                    </>
                  )}
                </Card>
              </Col>

              <Col md={4} className="d-flex">
                <Card
                  className="gx-5 flex-grow-1"
                  style={{
                    border: "1px solid #ddd",
                    padding: "10px",
                    textAlign: "center",
                    borderRadius: "8px",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                    flexGrow: 1,
                  }}
                >
                  <h5>{t("Control")}</h5>
                  <FontAwesomeIcon
                    icon={faCheckToSlot}
                    style={{
                      cursor: "pointer",
                      fontSize: "24px",
                      color: "#007bff",
                    }}
                    onClick={() => handleIconClick("control")}
                  />
                  {activePopup === "control" && (
                    <>
                      <div
                        style={{
                          position: "fixed",
                          top: "0",
                          left: "0",
                          width: "100%",
                          height: "100%",
                          backgroundColor: "rgba(0, 0, 0, 0.3)", // Semi-transparent background
                          backdropFilter: "blur(5px)", // Blur effect
                          zIndex: 2,
                        }}
                      />
                      <div
                        style={{
                          position: "fixed",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          width: "400px",
                          padding: "40px",
                          backgroundColor: "#fff",
                          border: "1px solid #ddd",
                          borderRadius: "8px",
                          zIndex: 2,
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faTimes}
                          className="position-absolute text-primary"
                          style={{
                            top: "15px",
                            right: "15px",
                            cursor: "pointer",
                            fontSize: "20px",
                          }}
                          onClick={closePopup}
                        />
                        <h4
                          style={{
                            textAlign: "center",
                            marginBottom: "20px",
                            color: "#007bff",
                          }}
                        >
                           {t("Related Control")}
                        </h4>
                        <div
                          style={{
                            textAlign: "left",
                            marginTop: "20px",
                            maxHeight: "40vh",
                            overflowY: "auto",
                          }}
                        >
                          {renderControlItems()}
                        </div>
                      </div>
                    </>
                  )}
                </Card>
              </Col>
            </Row>

            {/* </div> */}
          </Col>
        </Row>
        {/* <Row>
          <Col md={4}>
            <Chart
              chart="RA_INHERENT_SCORE"
              defaultFilter={{ processId: objectId }}
            />
          </Col>
        </Row> */}
        <Row>
          {/* <Row>
            <Col md={4}>
              <Chart
                chart="GL_LOSS_RATING"
                defaultFilter={{ processId: objectId }}
              />
            </Col>
            <Col md={4}>
              <Chart
                chart="GL_ISSUE_RATING"
                defaultFilter={{ processId: objectId }}
              />
            </Col>
            <Col md={4}>
              <div class="row" id="scrollspyHeading1">
                <div class="col">
                  <Chart
                    chart="GL_KRI_RATING"
                    defaultFilter={{ processId: objectId }}
                  />
                </div>
              </div>
            </Col>
          </Row> */}

          <Row>
            <Col md={6}>
              <ReportRuntime
                report="GL_LOSS_BUSINESS_UNIT"
                drilldownReports={{ objectId: objectId }}
              />
            </Col>

            <Col md={6}>
              <Chart
                chart="RA_HEAT_MAP_RISK"
                defaultFilter={{ processId: objectId }}
                customExpressionFlag
              />
            </Col>
          </Row>
          <Row>
            <ReportRuntime
              report="RA_RISK_IN_MOTION_RISK_ID"
              drilldownReports={{ objectId: objectId }}
            />
          </Row>
        </Row>
        {/* <Row className="p-0 m-0">
          <Card className="shadow-lg p-4 mb-5 rounded position-relative">
            <Card.Body style={{ height: "410px" }}>
              <div>
                <h5>Risk Average Trends</h5>
                {chartData ? (
                  <Line data={chartData} options={options} height={100} />
                ) : (
                  <p>No chart available</p>
                )}
              </div>
            </Card.Body>
          </Card>
        </Row> */}
        {/* <Row>
          <Chart chart="GL_RISK_AVERAGE" />
        </Row> */}
      </Container>
    </div>
  );
};

export default Default;
