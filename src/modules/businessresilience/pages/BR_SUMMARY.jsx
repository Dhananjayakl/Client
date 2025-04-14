import {
  Row,
  Col,
  Card,
  Table,
  Tab,
  Modal,
  Button,
  ListGroup,
} from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { getBusinessCountByFinancialYear, getObjectCount } from "../BRService";
import { useEffect, useState } from "react";
import ReportRuntime from "src/components/reports/Report";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LandingPagesTitle from "src/components/pages/LandingPagesTitle";
import * as util from "src/components/forms/reactformutils/elements/formutilfunctions";
import Chart from "src/components/charts/Chart";
import { useTranslation } from "react-i18next";

import {
  faArrowsRotate,
  faEye,
  faFileShield,
  faGears,
  faLaptop,
  faPlus,
  faPlusCircle,
  faSitemap,
  faSquareCheck,
  faUserLarge,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { Bar, Doughnut, Pie } from "react-chartjs-2";
import { faSearchengin } from "@fortawesome/free-brands-svg-icons";
import AxiosInstance from "src/utils/AxiosInstance";

const Default = () => {
  let [yearProp, setYearProp] = useState(new Date().getFullYear());

  const handleYearCallback = (year) => {
    setYearProp(year);
  };

  let privs = util.getCurrentUser().privileges?.split(",");
  const initialTab = window.history.state?.activeTab || "BR_DASHBOARD";
  const [activeTab, setActiveTab] = useState(initialTab);
  const handleSelect = (key) => {
    if (key !== null) {
      setActiveTab(key);
      window.history.replaceState({ activeTab: key }, "");
    }
  };
  const { t } = useTranslation("common");

  return (
    <div>
      <Tab.Container id="menu" activeKey={activeTab} onSelect={handleSelect}>
        <LandingPagesTitle
          title={t("Manage BR Program")}
          showYearFilter
          // configurationForm="biaconfigurationsetup"
          // privileges="BR_SETUP_BR"
          tabs={[
            {
              title: t("Overview"),
              key: "BR_DASHBOARD",
              privilege: "BR_CREATE_BIA",
            },
            // {
            //   title: "Timeline",
            //   key: "BR_TIMELINE",
            //   privilege: "BR_VIEW_BCP",
            // },
            {
              title: t("Business Impact Analysis"),
              key: "BR_BIA",
              privilege: "BR_CREATE_BIA",
            },
            {
              title: t("Recovery Strategy"),
              key: "BR_RECOVERY",
              privilege: "BR_VIEW_BCP",
            },
            {
              title: t("Business Continuity Planning"),
              key: "BR_BCP",
              privilege: "BR_VIEW_BCP",
            },
            {
              title: t("Exercises"),
              key: "BR_EXERCISE",
              privilege: "BR_VIEW_BCP",
            },
          ]}
          onYearChange={handleYearCallback}
        />

        <Tab.Content>
          <Tab.Pane eventKey="BR_DASHBOARD" unmountOnExit>
            <Configuration
              handleSelect={handleSelect}
              privs={privs}
              // forms={forms}
              // reports={reports}
              // chart={chart}
              yearProp={yearProp}
            />
          </Tab.Pane>
          <Tab.Pane eventKey="BR_BIA" unmountOnExit>
            <BR_BIA privs={privs} yearProp={yearProp} />
          </Tab.Pane>
          <Tab.Pane eventKey="BR_RECOVERY" unmountOnExit>
            <BR_RECOVERY privs={privs} yearProp={yearProp} />
          </Tab.Pane>
          <Tab.Pane eventKey="BR_BCP" unmountOnExit>
            <BR_BCP privs={privs} yearProp={yearProp} />
          </Tab.Pane>
          <Tab.Pane eventKey="BR_EXERCISE" unmountOnExit>
            <BR_EXERCISE privs={privs} yearProp={yearProp} />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
};
export default Default;
let Configuration = ({ handleSelect, privs, yearProp }) => {
  const [businessData, setBusinessData] = useState(null);
  const { t } = useTranslation("common");

  let userId = JSON.parse(localStorage.current_logged_User)[0].user_details
    .data[0].user_id;

  const [objectId, setReportfilter] = useState("");
  let currentYear = new Date().getFullYear();
  let grcYear =
    parseInt(yearProp) === currentYear
      ? yearProp
      : (parseInt(yearProp) + 1).toString();

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
  const navigate = useNavigate();
  const handleClose = () => {
    setRefreshReports(true);
    setShowModal(false);
  };
  const handleClick = (route) => {
    navigate(route);
  };
  const handleShow = (reportName) => {
    setRefreshReports(true);
    setSelectedReport(reportName);
    setShowModal(true);
  };

  const [riskData, setriskData] = useState("");
  const fetchCardData = async (logInId, year) => {
    try {
      const response = await AxiosInstance.get(
        `/riskmanagement/grcOverview/${logInId}?year=${Number(year)}`
      );
      console.log(response.data, "data card response");

      if (response.data) {
        setriskData({
          process_bt: response.data.process_bt || 0,
          asset_bt: response.data.asset_bt || 0,
          thirdparty_bt: response.data.thirdparty_bt || 0,
          sop_bt: response.data.standard_operating_procedures_bt || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching card data:", error);
    }
  };

  console.log(riskData, "riskDatariskData");
  let userIds = JSON.parse(localStorage.current_logged_User)[0]?.user_details
    .data[0]?.user_id;

  useEffect(() => {
    fetchCardData(userIds, yearProp);
  }, [yearProp, userIds]);
  const cardData = [
    {
      title: t("Process"),
      value: riskData?.process_bt,
      icon: faGears,
      report: "GL_PROCESS_BY_ORG",
      form: "process",
    },
    {
      title: t("Assets"),
      value: riskData?.asset_bt,
      icon: faLaptop,
      report: "GL_ASSET_BY_ORG",
      form: "asset",
    },
    {
      title: t("Third-Party"),
      value: riskData?.thirdparty_bt,
      icon: faUsers,
      report: "GL_THIRD_PARTY_BY_ORG",
      form: "thirdparty",
    },
    {
      title: t("SOP"),
      value: riskData?.sop_bt,
      icon: faArrowsRotate,
      report: "GL_SOP_BY_ORG",
      form: "standardoperatingprocedures",
    },
    {
      title: t("Business Resilience Framework"),
      value: "",
      icon: faSitemap,
      report: "GL_BR_FRAMEWORK_BY_ORG",
      form: "businessresilienceframework",
    },
  ];

  const riskCategories = ["High", "Medium", "Low"];

  const riskMap = riskCategories?.reduce((acc, category) => {
    acc[category] = 0;
    return acc;
  }, {});

  businessData?.raRating?.forEach(({ d_risk_rating, count }) => {
    riskMap[d_risk_rating] = count;
  });

  const riskColors = {
    High: "red",
    Medium: "#FFFF00",
    Low: "#8BFF16",
  };

  const allFrequencies = ["Annual", "Biennial"];

  const frequencyMap = allFrequencies?.reduce((acc, freq) => {
    acc[freq] = 0;
    return acc;
  }, {});

  businessData?.bcpFrequncy?.forEach(({ d_frequency_review, count }) => {
    frequencyMap[d_frequency_review] = count;
  });

  const recoveryStatuses = ["Recovered", "Unrecovered"];

  const recoveryMap = recoveryStatuses?.reduce((acc, status) => {
    acc[status] = 0;
    return acc;
  }, {});

  businessData?.processRecovered?.forEach(({ d_process_recovered, count }) => {
    recoveryMap[d_process_recovered] = count;
  });

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
              drilldownReports={{ objectId, grcYear }}
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
      {/* <div className="d-flex justify-content-evenly">
        {cardData.map((card, index) => (
          <Card
            key={index}
            className="reportChart-cards"
            style={{
              width: "19%",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              transform: isHovered === index ? "scale(1.05)" : "scale(1)",
            }}
            onMouseEnter={() => setIsHovered(index)}
            onMouseLeave={() => setIsHovered(null)}
          >
            <Card.Body>
              <Row>
                <Col>
                  <Row className="ms-1">{card.title}</Row>
                  <Row>
                    <h2 className="ms-1 mt-2">{card.value}</h2>
                  </Row>
                </Col>
                <Col className="d-flex align-items-center justify-content-end">
                  <FontAwesomeIcon icon={card.icon} size="4x" />
                </Col>
              </Row>
            </Card.Body>

            <Table bordered className="m-0">
              <thead className="border-bottom-0  border-start-0 border-end-0 ">
                <tr className="border-bottom-0 border-start-0 border-end-0 border ">
                  <td
                    onClick={() =>
                      handleClick(`/form/runtime?formService=${card.form}`)
                    }
                    style={{ cursor: "pointer" }}
                  >
                    Create
                  </td>
                  <td
                    onClick={() => handleShow(card.report)}
                    style={{ cursor: "pointer" }}
                  >
                    View
                  </td>
                </tr>
              </thead>
            </Table>
          </Card>
        ))}
      </div> */}
      <div className="d-flex flex-wrarp justify-content-evenly">
        {cardData.map((card, index) => (
          <Card
            key={index}
            className="reportChart-cards"
            style={{
              width: "19%",
              minHeight: "0px",
              borderRadius: "15px",
              padding: "10px 0px",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              // transform: isHovered === index ? "scale(1.05)" : "scale(1)",
            }}
            // onMouseEnter={() => setIsHovered(index)}
            // onMouseLeave={() => setIsHovered(null)}
          >
            <Card.Body>
              <Row>
                <Col>
                  <h6 className="ms-1 fw-bold text-primary">{card.title}</h6>
                  <h2 className="ms-1 mt-2 text-dark">{card.value}</h2>
                </Col>
                <Col className="d-flex align-items-center justify-content-end">
                  <FontAwesomeIcon
                    icon={card.icon}
                    size="3x"
                    className="text-secondary"
                  />
                </Col>
              </Row>
            </Card.Body>

            <Table bordered className="m-0">
              <thead className="border-bottom-0  border-start-0 border-end-0 ">
                <tr className="border-bottom-0 border-start-0 border-end-0 border ">
                  <td
                    onClick={() =>
                      handleClick(`/form/runtime?formService=${card.form}`)
                    }
                    className="table-btn text-center"
                  >
                    <FontAwesomeIcon icon={faPlusCircle} className="me-2" />
                    {t("Create")}
                  </td>
                  <td
                    onClick={() => handleShow(card.report)}
                    className="table-btn text-center"
                  >
                    <FontAwesomeIcon icon={faEye} className="me-2" />
                    {t("View")}
                  </td>
                </tr>
              </thead>
            </Table>
          </Card>
        ))}
      </div>
      {privs.includes("BR_VIEW_EXERCISE") && (
        <>
          <div className=" ms-2 me-2">
            <Row>
              <Col md={3} className="">
                <Card
                  className="reportChart-cards ms-1"
                  style={{
                    height: "220px",
                    borderRadius: "15px",
                    padding: "0px",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  }}
                >
                  <Card.Body>
                    <Row className="">
                      <h5 className="  ms-1  fw-bold text-primary text-center">
                        {" "}
                        {t("BIA's Completed")}
                      </h5>
                      <Chart
                        chart="BR_BIA_COMPLETED_CHART"
                        yearProp={yearProp}
                        yearFlag
                      />
                    </Row>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={3}>
                <Card
                  className="reportChart-cards ms-1"
                  style={{
                    height: "220px",
                    borderRadius: "15px",
                    padding: "0px",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  }}
                >
                  <Card.Body>
                    <Row className="">
                      <h5 className="  ms-1  fw-bold text-primary text-center">
                        {" "}
                        {t("Plans Completed")}
                      </h5>
                      <Chart
                        chart="BR_BCP_COMPLETED_CHART"
                        yearProp={yearProp}
                        yearFlag
                      />
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                {" "}
                <Card
                  className="reportChart-cards ms-1"
                  style={{
                    height: "220px",
                    borderRadius: "15px",
                    padding: "0px",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  }}
                >
                  <Card.Body>
                    <h5 className="  ms-1  fw-bold text-primary text-center">
                      {" "}
                      {t("Plans Exercised")}
                    </h5>
                    <Chart
                      chart="BR_BCP_PLANS_EXERCISE_CHART"
                      yearFlag
                      yearProp={yearProp}
                    />
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card
                  className="reportChart-cards ms-1 me-3"
                  style={{
                    // width: "90%",
                    height: "220px",
                    borderRadius: "15px",
                    padding: "0px",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  }}
                >
                  <Card.Body>
                    <h5 className=" ms-1  fw-bold text-primary text-center">
                      {" "}
                      {t("Recovered % in Exercises")}
                    </h5>
                    <Chart
                      chart="BR_EXERCISE_RECOVERED_CHART"
                      yearProp={yearProp}
                      yearFlag
                    />{" "}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        </>
      )}
      <div
        className="d-flex ms-2 me-2"
        // Wrap it in an arrow function
      >
        <Card
          className="w-100"
          style={{
            backgroundColor: "#4FFFB0",
            color: "black",
            height: "40px",
            // padding: "10px",
            borderRadius: "8px",
          }}
        >
          <Card.Body>
            <Col className="d-flex ">
              <div
                className="d-flex align-items-center justify-content-center  fs-4"
                onClick={() => handleSelect("BR_BIA")}
                style={{ cursor: "pointer" }}
              >
                {t("Business Impact Analysis")}{" "}
                <span className="ms-2">
                  <FontAwesomeIcon icon={faSearchengin} />
                </span>
              </div>
            </Col>
          </Card.Body>
        </Card>
      </div>
      <div className="ms-3 me-3">
        <Row>
          <Col md={2} className="">
            <Card
              className="reportChart-cards "
              style={{
                // width: "90%",
                height: "185px",
                borderRadius: "15px",
                padding: "0px",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                // transform: isHovered === true ? "scale(1.05)" : "scale(1)",
              }}
              // onMouseEnter={() => setIsHovered(true)}
              // onMouseLeave={() => setIsHovered(false)}
            >
              <Card.Body>
                <Row className="d-flex align-items-center justify-content-center mb-2 fs-4">
                  <h5 className="  ms-1  fw-bold text-primary text-center">
                    {" "}
                    {t("Business Impact Analysis")}
                  </h5>
                </Row>
                <Row className="d-flex mt-5">
                  <Col
                    className="text-center"
                    onClick={() =>
                      handleClick(
                        `/form/runtime?formService=businessimpactanalysis`
                      )
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <FontAwesomeIcon icon={faPlusCircle} size="2x" />
                  </Col>
                  <Col className="text-center">
                    <h2 className="text-dark">
                      {businessData?.businessImpactAnalysisCount}
                    </h2>
                  </Col>
                  <Col
                    className="text-center"
                    onClick={() => handleShow("BR_BIA_BY_ORG")}
                    style={{ cursor: "pointer" }}
                  >
                    <FontAwesomeIcon icon={faFileShield} size="2x" />
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card
              className="reportChart-cards ms-1"
              style={{
                height: "185px",
                borderRadius: "15px",
                padding: "0px",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
            >
              <Card.Body>
                <Row className="">
                  <h5 className="  ms-1  fw-bold text-primary text-center">
                    {" "}
                    {t("BIA By Status")}
                  </h5>
                  <Chart
                    chart="BR_BIA_BY_STATUS"
                    yearProp={yearProp}
                    yearFlag
                  />
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            {" "}
            <Card
              className="reportChart-cards ms-1"
              style={{
                height: "185px",
                borderRadius: "15px",
                padding: "0px",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
            >
              <Card.Body>
                <h5 className="  ms-1  fw-bold text-primary text-center">
                  {" "}
                  {t("Process Asset Dependency")}
                </h5>
                <Chart
                  chart="BR_DEPENDENCY_GAP_CHART"
                  yearFlag
                  yearProp={yearProp}
                />
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card
              className="reportChart-cards ms-1"
              style={{
                // width: "90%",
                height: "185px",
                borderRadius: "15px",
                padding: "0px",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
            >
              <Card.Body>
                <h5 className=" ms-1  fw-bold text-primary text-center">
                  {" "}
                  {t("BIA's By Business Criticality")}
                </h5>
                <Chart
                  chart="GL_BIA_BUSINESS_CRITICALITY"
                  yearProp={yearProp}
                  // drilldownReports={{ grcYear }}
                  // defaultFilter={{ grcYear: grcYear }}
                  customExpressionFlag
                  yearFlag
                />{" "}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
      {/* BR_CREATE_BIA */}
      {privs.includes("BR_VIEW_EXERCISE") && (
        <>
          <div className="d-flex ms-2 me-2">
            <Card
              className="w-100"
              style={{
                backgroundColor: "#6CB4EE",
                color: "black",
                height: "40px",
                // padding: "10px",
                borderRadius: "8px",
              }}
            >
              <Card.Body>
                <Col className="d-flex ">
                  <div
                    className="d-flex align-items-center justify-content-center  fs-4"
                    onClick={() => handleSelect("BR_RECOVERY")}
                    style={{ cursor: "pointer" }}
                  >
                    {t("Risk Assessment / Recovery Strategy")}{" "}
                    <span className="ms-2">
                      <FontAwesomeIcon icon={faArrowsRotate} />
                    </span>
                  </div>
                </Col>
              </Card.Body>
            </Card>
          </div>
          <div className="ms-3 me-3">
            <Row>
              <Col md={3} className="">
                <Card
                  className="reportChart-cards  "
                  style={{
                    height: "185px",
                    borderRadius: "15px",
                    padding: "0px",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  }}
                >
                  <Card.Body>
                    <Row className="d-flex align-items-center justify-content-center mb-2 fs-4">
                      <h5 className="  ms-1 fw-bold text-primary text-center">
                        {" "}
                        {t("RA & Recovery Strategy")}
                      </h5>
                    </Row>
                    <Row className=" d-flex mt-6">
                      <Col
                        className="text-center"
                        onClick={() =>
                          handleClick(`/form/runtime?formService=rarecovery`)
                        }
                        style={{ cursor: "pointer" }}
                      >
                        <FontAwesomeIcon icon={faPlusCircle} size="2x" />
                      </Col>
                      <Col className="text-center">
                        <h2 className="text-dark">
                          {businessData?.recoveryStrategyCount}
                        </h2>
                      </Col>
                      <Col
                        className="text-center"
                        onClick={() => handleShow("BR_RECOVERY_STRATEGY")}
                        style={{ cursor: "pointer" }}
                      >
                        <FontAwesomeIcon icon={faFileShield} size="2x" />
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4} className="">
                <Card
                  className="reportChart-cards ms-1"
                  style={{
                    height: "185px",
                    borderRadius: "15px",
                    padding: "0px",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  }}
                >
                  <Card.Body className="d-flex align-items-center justify-content-between">
                    <div>
                      <h5 className="  ms-1 fw-bold text-primary text-center">
                        {" "}
                        {t("RA & Recovery Strategy By Status")}
                      </h5>
                      <Chart
                        chart="BR_RA_BY_STATUS"
                        yearProp={yearProp}
                        yearFlag
                      />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={5} className="">
                <Card
                  className="reportChart-cards "
                  style={{
                    height: "185px",
                    borderRadius: "15px",
                    padding: "0px",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  }}
                >
                  <Card.Body>
                    <h5 className="  ms-1 fw-bold text-primary text-center">
                      {t("RA & Recovery Strategy by Rating")}
                    </h5>

                    <Table
                      className="mt-3"
                      style={{
                        width: "100%",
                        textAlign: "center",
                        borderCollapse: "collapse",
                      }}
                    >
                      <tbody>
                        <tr>
                          {riskCategories?.map((category, index) => (
                            <td
                              key={category}
                              className="border-bottom-0"
                              style={
                                index > 0
                                  ? { borderLeft: "2px solid black" }
                                  : {}
                              }
                            >
                              {category}{" "}
                              <span
                                className="d-inline-block rounded ms-1"
                                style={{
                                  width: "12px",
                                  height: "12px",
                                  backgroundColor: riskColors[category],
                                }}
                              ></span>
                            </td>
                          ))}
                        </tr>
                        <tr>
                          {riskCategories?.map((category, index) => (
                            <td
                              key={category}
                              className="border-bottom-0"
                              style={
                                index > 0
                                  ? { borderLeft: "2px solid black" }
                                  : {}
                              }
                            >
                              <h1>{riskMap[category]}</h1>
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
          <div className="">
            <Card
              className="w-100"
              style={{
                backgroundColor: "#E9967A",
                color: "black",
                height: "40px",
                // padding: "10px",
                borderRadius: "8px",
              }}
            >
              <Card.Body>
                <Col className="d-flex ">
                  <div
                    className="d-flex align-items-center justify-content-center  fs-4"
                    onClick={() => handleSelect("BR_BCP")}
                    style={{ cursor: "pointer" }}
                  >
                    {t("Business Continuity Planning")}{" "}
                    <span className="ms-2">
                      <FontAwesomeIcon icon={faUserLarge} />
                    </span>
                  </div>
                </Col>
              </Card.Body>
            </Card>
          </div>
          <div className=" ms-3 me-3 ">
            <Row>
              <Col md={3} className="">
                <Card
                  className="reportChart-cards  "
                  style={{
                    // width: "19%",
                    height: "190px",
                    borderRadius: "15px",
                    padding: "0px",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  }}
                >
                  <Card.Body>
                    <Row className="d-flex align-items-center justify-content-center mb-2 fs-4">
                      <h5 className="  ms-1 fw-bold text-primary text-center">
                        {" "}
                        {t("Business Continuity Plans")}
                      </h5>
                    </Row>
                    <Row className="mt-6">
                      <Col className="text-center">
                        <FontAwesomeIcon
                          icon={faPlusCircle}
                          size="2x"
                          onClick={() =>
                            handleClick(
                              `/form/runtime?formService=businessconplan`
                            )
                          }
                          style={{ cursor: "pointer" }}
                        />
                      </Col>
                      <Col className="text-center">
                        <h1 className="text-dark">
                          {businessData?.businessContinuityPlanCount}
                        </h1>
                      </Col>
                      <Col
                        className="text-center"
                        onClick={() => handleShow("BR_CONTINUITY_PLAN_BY_ORG")}
                        style={{ cursor: "pointer" }}
                      >
                        <FontAwesomeIcon icon={faFileShield} size="2x" />
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6} className="">
                <Card
                  className="reportChart-cards ms-1"
                  style={{
                    height: "190px",
                    borderRadius: "15px",
                    padding: "0px",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  }}
                >
                  <Card.Body className="d-flex align-items-center justify-content-between">
                    <div>
                      <h5 className="  ms-1 fw-bold text-primary text-center">
                        {" "}
                        {t("BC Plans By Status")}
                      </h5>
                      <Chart
                        chart="BR_BC_PLAN_BY_STATUS"
                        yearProp={yearProp}
                        yearFlag
                      />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3} className="">
                <Card
                  className="reportChart-cards"
                  style={{
                    height: "190px",
                    borderRadius: "15px",
                    padding: "0px",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  }}
                >
                  <Card.Body>
                    <Row className="d-flex align-items-center justify-content-evenly mb-2 fs-4">
                      {" "}
                      <h5 className="  ms-1 fw-bold text-primary text-center">
                        {t("BC Plans By Frequency")}
                      </h5>
                    </Row>
                    <Row className="mt-0">
                      <Table bordered className="m-0">
                        <thead className="border-top-0 border-start-0 border-end-0">
                          <tr className="border-top-0 border-start-0 border-end-0 border">
                            <th>{t("Frequency")}</th>
                            <th>{t("# Count")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {allFrequencies.map((freq) => (
                            <tr key={freq}>
                              <td className="fw-bold">{freq}</td>
                              <td>{frequencyMap[freq]}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
          <div className="d-flex ms-2 me-2">
            <Card
              className="w-100"
              style={{
                backgroundColor: "#BFE274",
                color: "black",
                height: "40px",
                // padding: "10px",
                borderRadius: "8px",
              }}
            >
              <Card.Body>
                <Col className="d-flex ">
                  <div
                    className="d-flex align-items-center justify-content-center  fs-4"
                    onClick={() => handleSelect("BR_EXERCISE")}
                    style={{ cursor: "pointer" }}
                  >
                    {t("Exercises")}
                    <span className="ms-2">
                      <FontAwesomeIcon icon={faSquareCheck} />
                    </span>
                  </div>
                </Col>
              </Card.Body>
            </Card>
          </div>
          <div className="ms-3 me-3">
            <Row>
              <Col md={2} className="">
                <Card
                  className="reportChart-cards  "
                  style={{
                    height: "185px",
                    borderRadius: "15px",
                    padding: "0px",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  }}
                >
                  <Card.Body>
                    <Row className="d-flex align-items-center justify-content-center mb-2 fs-4">
                      <h5 className="  ms-1  fw-bold text-primary text-center">
                        {t("Exercises")}
                      </h5>
                    </Row>
                    <Row className="mt-6">
                      <Col
                        className="text-center"
                        onClick={() =>
                          handleClick(`/form/runtime?formService=exercisePlan`)
                        }
                        style={{ cursor: "pointer" }}
                      >
                        <FontAwesomeIcon icon={faPlusCircle} size="2x" />
                      </Col>
                      <Col className="text-center">
                        <h2 className="text-dark">
                          {businessData?.exercisePlanCount}
                        </h2>
                      </Col>
                      <Col
                        className="text-center"
                        onClick={() => handleShow("BR_EXERCISE_PLAN_BY_ORG")}
                        style={{ cursor: "pointer" }}
                      >
                        <FontAwesomeIcon icon={faFileShield} size="2x" />
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4} className="">
                <Card
                  className="reportChart-cards ms-1"
                  style={{
                    height: "185px",
                    overflow: "hidden",
                    minHeight: "0px",
                    borderRadius: "15px",
                    padding: "0px",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  }}
                >
                  <Card.Body>
                    <div className="text-center fs-4 mb-2">
                      {" "}
                      <h5 className="  ms-1  fw-bold text-primary text-center">
                        {t("Exercises by Status")}
                      </h5>
                    </div>
                    <div
                      className="mt-4"
                      style={{ overflowX: "auto", maxWidth: "100%" }}
                    >
                      {businessData?.exerciseStatus?.length > 0 ? (
                        <Table
                          style={{
                            width: "100%",
                            textAlign: "center",
                            borderCollapse: "collapse",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <tbody>
                            <tr>
                              {businessData?.exerciseStatus.map(
                                (item, index) => (
                                  <td
                                    key={index}
                                    className="border-bottom-0"
                                    style={
                                      index !== 0
                                        ? { borderLeft: "2px solid black" }
                                        : {}
                                    }
                                  >
                                    {item.status}
                                  </td>
                                )
                              )}
                            </tr>

                            <tr>
                              {businessData?.exerciseStatus.map(
                                (item, index) => (
                                  <td
                                    key={index}
                                    className="border-bottom-0"
                                    style={
                                      index !== 0
                                        ? { borderLeft: "2px solid black" }
                                        : {}
                                    }
                                  >
                                    <h1 style={{ fontSize: "1.5rem" }}>
                                      {item.count}
                                    </h1>
                                  </td>
                                )
                              )}
                            </tr>
                          </tbody>
                        </Table>
                      ) : (
                        <p className="d-flex align-items-center justify-content-center mt-3">
                          {t("No Data Available")}
                        </p>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3} className="">
                <Card
                  className="reportChart-cards ms-1"
                  style={{
                    height: "185px",
                    minHeight: "0px",
                    borderRadius: "15px",
                    padding: "0px",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  }}
                >
                  <Card.Body>
                    <h5 className="  ms-1  fw-bold text-primary text-center">
                      {t("Plans by Exercises Results")}
                    </h5>
                    <Chart
                      chart="BR_PLANS_BY_EXERCISE_RESULTS"
                      yearProp={yearProp}
                      yearFlag
                    />
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3} className="">
                <Card
                  className="reportChart-cards ms-1"
                  style={{
                    height: "185px",
                    minHeight: "0px",
                    borderRadius: "15px",
                    padding: "0px",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  }}
                >
                  <Card.Body>
                    <div className="text-center fs-4 mb-2">
                      <h5 className="  ms-1  fw-bold text-primary text-center">
                        {t("Plans By Exercises Status")}
                      </h5>
                    </div>

                    <Table
                      className="mt-4"
                      style={{
                        width: "100%",
                        textAlign: "center",
                        borderCollapse: "collapse",
                      }}
                    >
                      <tbody>
                        <tr>
                          {recoveryStatuses?.map((status, index) => (
                            <td
                              key={status}
                              className="border-bottom-0"
                              style={
                                index > 0
                                  ? { borderLeft: "2px solid black" }
                                  : {}
                              }
                            >
                              {status}
                            </td>
                          ))}
                        </tr>
                        <tr>
                          {recoveryStatuses?.map((status, index) => (
                            <td
                              key={status}
                              className="border-bottom-0"
                              style={
                                index > 0
                                  ? { borderLeft: "2px solid black" }
                                  : {}
                              }
                            >
                              <h1>{recoveryMap[status]}</h1>
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        </>
      )}
    </>
  );
};

// export default Configuration;

let BR_BIA = ({ privs, yearProp }) => {
  let currentYear = new Date().getFullYear();
  let grcYear =
    parseInt(yearProp) === currentYear
      ? yearProp
      : (parseInt(yearProp) + 1).toString();

  return (
    <div className="">
      {privs.includes("BR_CREATE_BIA") && (
        <>
          <Row>
            <ReportRuntime report="BR_MY_BIA_RPT" yearProp={yearProp} />
          </Row>
          <Row>
            <ReportRuntime
              report="BR_PROCESS_PROGRAM_REP"
              yearProp={yearProp}
            />
          </Row>
          <Row>
            <ReportRuntime report="BR_ASSET_PROGRAM_REP" yearProp={yearProp} />
          </Row>
          <Row>
            <ReportRuntime report="BR_BIA_REPORT" yearProp={yearProp} />
          </Row>
          {/* <Row>
            <ReportRuntime
              report="GL_PROCESS_ASSET"
              yearProp={yearProp}
              drilldownReports={{ grcYear }}
            />
          </Row> */}
        </>
      )}
      {privs.includes("BR_VIEW_BIA") && (
        <>
          {/* <div className="pe-0">
            <Row id="scrollspyHeading1">
              <Col>
                <Chart chart="BR_DEPENDENCY_GAP_CHART" />
              </Col>
              <Col>
                <Chart chart="GL_BIA_BUSINESS_CRITICALITY" />{" "}
              </Col>
              <Col>
                {" "}
                <Chart chart="BR_BIA_BY_STATUS" />
              </Col>
            </Row>
          </div> */}
        </>
      )}
    </div>
  );
};
let BR_RECOVERY = ({ privs, yearProp }) => {
  return (
    <div className="">
      {privs.includes("BR_VIEW_RA") && (
        <>
          {privs.includes("BR_VIEW_RA") && (
            <>
              <Row>
                <ReportRuntime
                  report="BR_RA_RECOVERY_STRATEGY"
                  yearProp={yearProp}
                />
              </Row>
            </>
          )}
        </>
      )}
    </div>
  );
};

let BR_BCP = ({ privs, yearProp }) => {
  return (
    <div className="">
      {privs.includes("BR_VIEW_BCP") && (
        <>
          <Row>
            <ReportRuntime report="BR_BCP_LIST_RPT" yearProp={yearProp} />
          </Row>
          {/* <Row id="scrollspyHeading1" className="ms-1 me-1">
            <Chart chart="BR_BC_PLAN_BY_STATUS" />
          </Row> */}
        </>
      )}
    </div>
  );
};
let BR_EXERCISE = ({ privs, yearProp }) => {
  return (
    <div className="">
      {privs.includes("BR_VIEW_EXERCISE") && (
        <>
          <Row>
            <ReportRuntime
              report="BR_EXERCISE_LIST_REPORT"
              yearProp={yearProp}
            />
          </Row>
          <Row>
            <ReportRuntime report="BR_ACTIVE_EXCERCISES" yearProp={yearProp} />
          </Row>

          <Row id="scrollspyHeading1">
            <Col>
              {" "}
              <Chart
                chart="BR_PLANS_BY_EXERCISE_STATUS"
                yearProp={yearProp}
                yearFlag
              />
            </Col>
            <Col>
              <Chart
                chart="BR_EXERCISE_BY_STATUS"
                yearProp={yearProp}
                yearFlag
              />
            </Col>
            <Col>
              <Chart
                chart="IR_BR_ISSUE_BY_STATUS"
                yearProp={yearProp}
                yearFlag
              />
            </Col>
          </Row>

          <Row id="scrollspyHeading1">
            {/* <Col>
              <Chart chart="IR_BR_ISSUE_BY_STATUS" yearProp={yearProp} />
            </Col> */}
            <Col>
              {/* <Chart chart="BR_EXERCISE_BY_DATE" yearProp={yearProp} /> */}
            </Col>
          </Row>
          {/* <Row id="scrollspyHeading1" className="ms-1 me-1">
            <Chart chart="BR_EXERCISE_BY_DATE" />
          </Row> */}
        </>
      )}
    </div>
  );
};
