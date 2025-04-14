import { Row, Col, Card, Table, Tab } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { getObjectCount } from "../BRService";
import { useEffect, useState } from "react";
import ReportRuntime from "src/components/reports/Report";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LandingPagesTitle from "src/components/pages/LandingPagesTitle";
import * as util from "src/components/forms/reactformutils/elements/formutilfunctions";
import Chart from "src/components/charts/Chart";

import {
  faArrowsRotate,
  faFileShield,
  faGears,
  faLaptop,
  faPlusCircle,
  faSitemap,
  faSquareCheck,
  faUserLarge,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { Bar, Doughnut, Pie } from "react-chartjs-2";
import { faSearchengin } from "@fortawesome/free-brands-svg-icons";

const Default = () => {
  let privs = util.getCurrentUser().privileges?.split(",");
  const initialTab = window.history.state?.activeTab || "BR_DASHBOARD";
  const [activeTab, setActiveTab] = useState(initialTab);
  const handleSelect = (key) => {
    if (key !== null) {
      setActiveTab(key);
      window.history.replaceState({ activeTab: key }, "");
    }
  };
  return (
    <div>
      <Tab.Container id="menu" activeKey={activeTab} onSelect={handleSelect}>
        <LandingPagesTitle
          title="Manage BR Program"
          // showYearFilter
          // configurationForm="biaconfigurationsetup"
          // privileges="BR_SETUP_BR"
          tabs={[
            {
              title: "Overview",
              key: "BR_DASHBOARD",
              privilege: "BR_VIEW_BCP",
            },
            // {
            //   title: "Timeline",
            //   key: "BR_TIMELINE",
            //   privilege: "BR_VIEW_BCP",
            // },
            {
              title: "Business Impact Analysis",
              key: "BR_BIA",
              privilege: "BR_VIEW_BCP",
            },
            {
              title: "Recovery Strategy",
              key: "BR_RECOVERY",
              privilege: "BR_VIEW_BCP",
            },
            {
              title: "Business Continuity Planning",
              key: "BR_BCP",
              privilege: "BR_VIEW_BCP",
            },
            {
              title: "Exercises",
              key: "BR_EXERCISE",
              privilege: "BR_VIEW_BCP",
            },
          ]}
          // onYearChange={handleYearCallback}
        />

        <Tab.Content>
          <Tab.Pane eventKey="BR_DASHBOARD" unmountOnExit>
            <Configuration
              handleSelect={handleSelect}
              privs={privs}
              // forms={forms}
              // reports={reports}
              // chart={chart}
              // yearProp={yearProp}
            />
          </Tab.Pane>
          <Tab.Pane eventKey="BR_BIA" unmountOnExit>
            <BR_BIA privs={privs} />
          </Tab.Pane>
          <Tab.Pane eventKey="BR_RECOVERY" unmountOnExit>
            <BR_RECOVERY privs={privs} />
          </Tab.Pane>
          <Tab.Pane eventKey="BR_BCP" unmountOnExit>
            <BR_BCP privs={privs} />
          </Tab.Pane>
          <Tab.Pane eventKey="BR_EXERCISE" unmountOnExit>
            <BR_EXERCISE privs={privs} />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
};
export default Default;
let Configuration = ({ handleSelect, privs, yearProp }) => {
  const [biaCount, setbiaCount] = useState("");
  const [raCount, setraCount] = useState("");
  const [bcpCount, setbcpCount] = useState("");
  const [exerciseCount, setexerciseCount] = useState("");

  const location = useLocation();

  let filterExpressionbia;
  if (location?.state?.objectData?.type === "Asset") {
    filterExpressionbia = `asset_name=${location?.state?.objectData?.id}`;
  } else {
    filterExpressionbia = `process_name=${location?.state?.objectData?.id}`;
  }
  let filterExpressionra;
  if (location?.state?.objectData?.type === "Asset") {
    filterExpressionra = `asset_name=${location?.state?.objectData?.id}`;
  } else {
    filterExpressionra = `process_name=${location?.state?.objectData?.id}`;
  }
  let filterExpressionbcp;
  if (location?.state?.objectData?.type === "Asset") {
    filterExpressionbcp = `${location?.state?.objectData?.bia_id} IN (SELECT * FROM UNNEST(process_asset))`;
  } else {
    filterExpressionbcp = `${location?.state?.objectData?.bia_id} IN (SELECT * FROM UNNEST(process_asset))`;
  }
  let impactRating = location?.state?.objectData;
  let filterExpressionexercise = `scope in (select object_id from pa_br_business_continuity_plan_bt  where ${location?.state?.objectData?.bia_id} IN (SELECT * FROM UNNEST(process_asset)))`;

  useEffect(() => {
    if (location?.state?.objectData?.id !== "") {
      getObjectCount(
        "getObjectCount",
        "pa_br_business_impact_analysis_bt",
        filterExpressionbia
      )
        .then((response) => {
          setbiaCount(response.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    if (location?.state?.objectData?.id !== "") {
      getObjectCount(
        "getObjectCount",
        "pa_br_ra_recovery_strategy_bt",
        filterExpressionra
      )
        .then((response) => {
          setraCount(response.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    if (location?.state?.objectData?.bia_id !== "") {
      getObjectCount(
        "getObjectCount",
        "pa_br_business_continuity_plan_bt",
        filterExpressionbcp
      )
        .then((response) => {
          setbcpCount(response.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    if (location?.state?.objectData?.bia_id !== "") {
      getObjectCount(
        "getObjectCount",
        "pa_br_exercise_plan_bt",
        filterExpressionexercise
      )
        .then((response) => {
          setexerciseCount(response.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [
    location,
    filterExpressionbia,
    filterExpressionra,
    filterExpressionbcp,
    filterExpressionexercise,
  ]);
  const cardData = [
    { title: "Process", value: 3156, icon: faGears },
    { title: "Assets", value: 1240, icon: faLaptop },
    { title: "Third-Party", value: 874, icon: faUsers },
    { title: "SOP", value: 542, icon: faArrowsRotate },
    { title: " Resiliency Framework", value: "", icon: faSitemap },
  ];

  const statusData = [
    { name: "New", color: "#3498db", value: 1 },
    { name: "Pending Approval", color: "#f1c40f", value: 2 },
    { name: "Approved", color: "#2ecc71", value: 5 },
    { name: "Rejected", color: "#e74c3c", value: 3 },
    { name: "Pending Review", color: "#ffa500", value: 5 },
    { name: "Clarification Requested", color: "#e67e22", value: 3 },
  ];
  const data = {
    labels: [
      "New",
      "Pending Approval",
      "Approved",
      "Rejected",
      "Pending Review",
      "Clarification Requested",
    ],
    datasets: [
      {
        label: "Status Count",
        data: [1, 2, 5, 3, 8, 3],
        backgroundColor: [
          "#3498db",
          "#f1c40f",
          "#2ecc71",
          "#e74c3c",
          "#ffa500",
          "#e67e22",
        ],
        borderColor: [
          "#3498db",
          "#f1c40f",
          "#2ecc71",
          "#e74c3c",
          "#ffa500",
          "#e67e22",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        display: false,
      },
      title: {
        display: true,
        text: "BIA by Status",
        font: {
          size: 15,
          weight: 500,
        },
        padding: {
          top: 5,
          // bottom: 20,
        },
        // color: "#333",
      },
    },
  };
  const pieData = {
    labels: ["Positive", "Negative"],
    datasets: [
      {
        data: [65, 35],
        backgroundColor: ["#2ecc71", "#e74c3c"],
        borderColor: ["#27ae60", "#c0392b"],
        borderWidth: 1,
      },
    ],
  };

  const pieData2 = {
    labels: ["High", "Low"],
    datasets: [
      {
        data: [65, 35],
        backgroundColor: ["Orange", "Yellow"],
        borderColor: ["Orange", "Yellow"],
        borderWidth: 1,
      },
    ],
  };

  const pieData3 = {
    labels: ["New", "Pending Approval", "Approved"],
    datasets: [
      {
        label: "Status Count",
        data: [1, 2, 5, 3, 8, 3],
        backgroundColor: ["#3498db", "#f1c40f", "#2ecc71"],
        borderColor: ["#3498db", "#f1c40f", "#2ecc71"],
      },
    ],
  };
  const pieData4 = {
    labels: ["Pass", "Fail", "Inconclusive"],
    datasets: [
      {
        data: [65, 35, 78],
        backgroundColor: ["#2ecc71", "#e74c3c", "#ffa500"],
        borderColor: ["#27ae60", "#c0392b", "#ffa500"],
        borderWidth: 1,
      },
    ],
  };
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    // cutout: "80%",
    plugins: {
      legend: {
        display: false,
        position: "bottom",
      },
      title: {
        display: true,
        text: "BIA by Status",
        font: {
          size: 15,
          weight: 500,
        },
        padding: {
          top: 5,
          // bottom: 4,
        },
        // color: "#333",
      },
    },
  };
  const pieOptions3 = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "80%",
    plugins: {
      legend: {
        display: false,
        position: "bottom",
      },
      title: {
        display: true,
        text: "BCP by Status",
        font: {
          size: 15,
          weight: 500,
        },
        padding: {
          top: 5,
          bottom: 0,
        },
        // color: "#333",
      },
    },
  };

  const barData = {
    labels: ["Business Unit 1", "Business Unit 2", "Business Unit 3"], // X-axis labels
    datasets: [
      {
        label: "High",
        data: [30, 50, 20, 23, 23],
        backgroundColor: "#e74c3c",
      },
      {
        label: "Medium",
        data: [40, 110, 30, 63, 63],
        backgroundColor: "#f1c40f",
      },
      {
        label: "Low",
        data: [30, 30, 50, 63, 74],
        backgroundColor: "#2ecc71",
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y",
    scales: {
      x: {
        stacked: true,
        beginAtZero: true,
      },
      y: {
        stacked: true,
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "BCP by Business Unit",
        font: {
          size: 15,
          weight: 500,
        },
      },
    },
  };

  const pieOptions4 = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
        position: "bottom",
      },
      title: {
        display: true,
        text: "Plans by Exercise Results",
        font: {
          size: 15,
          weight: 500,
        },
        padding: {
          top: 5,
          bottom: 0,
        },
        // color: "#333",
      },
    },
  };

  // let tabNavigation = (key) => {
  //   console.log(key, "hdhd");

  //   setActiveTab(key);
  // };
  return (
    <>
      {/* <Card className="reportChart-cards" style={{ width: "20%" }}>
        <Card.Body>
          <Row>
            <Col>
              <Row className="ms-1">Process</Row>
              <Row>
                <h2 className="ms-1 mt-2">3156</h2>
              </Row>
            </Col>
            <Col className="d-flex align-items-center justify-content-end">
              <FontAwesomeIcon icon={faGears} size="4x" />
            </Col>
          </Row>
        </Card.Body>

        <Table striped bordered>
          <thead>
            <tr>
              <td>Create</td>
              <td>View</td>
            </tr>
          </thead>
        </Table>
      </Card> */}

      <div className="d-flex justify-content-evenly">
        {cardData.map((card, index) => (
          <Card
            key={index}
            className="reportChart-cards"
            style={{ width: "19%" }}
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
                  <td>Create</td>
                  <td>View</td>
                </tr>
              </thead>
            </Table>
          </Card>
        ))}
      </div>
      {/* {privs.includes("BR_VIEW_EXERCISE") && (
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
      )} */}
      <div
        className="d-flex ms-2 me-2"
        // Wrap it in an arrow function
      >
        <Card
          className="w-100"
          style={{
            backgroundColor: "#0FCFA2",
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
                Business Impact Analysis{" "}
                <span className="ms-2">
                  <FontAwesomeIcon icon={faSearchengin} />
                </span>
              </div>
            </Col>
          </Card.Body>
        </Card>
      </div>
      <div className="d-flex justify-content-evenly" style={{ height: "15%" }}>
        <Card className="reportChart-cards ms-2" style={{ width: "19%" }}>
          <Card.Body>
            <Row className="d-flex align-items-center justify-content-evenly mb-2 fs-4">
              Business Impact Analysis
            </Row>
            <Row className="d-flex mt-3">
              <Col className="text-center">
                <FontAwesomeIcon icon={faPlusCircle} size="2x" />
              </Col>
              <Col className="text-center">
                <h1>6572</h1>
              </Col>
              <Col className="text-center">
                <FontAwesomeIcon icon={faFileShield} size="2x" />
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Card className="reportChart-cards ms-1" style={{ width: "38%" }}>
          <Card.Body>
            <Row className="align-items-stretch">
              <Col md={8} className="d-flex align-items-center h-100">
                <div>
                  <Bar data={data} options={options} />
                </div>
              </Col>
              <Col md={4} className="d-flex">
                <div
                  style={{ height: "150px", overflowY: "auto", width: "100%" }}
                >
                  <Table
                    bordered
                    className="border-bottom-0"
                    style={{ display: "table" }}
                  >
                    <tbody>
                      {statusData.map((status, index) => (
                        <tr key={index}>
                          <td
                            style={{
                              backgroundColor: status.color,
                              color: "#fff",
                            }}
                          ></td>
                          <td>{status.name}</td>
                          <td>{status.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
        <Card className="reportChart-cards ms-1" style={{ width: "19%" }}>
          <Card.Body>
            <Row className="align-items-stretch">
              <Col className="d-flex align-items-center justify-content-center">
                <Doughnut data={pieData} options={pieOptions} />
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Card className="reportChart-cards ms-1" style={{ width: "19%" }}>
          <Card.Body>
            <Row className="align-items-stretch">
              <Col className="d-flex align-items-center justify-content-center">
                <Doughnut data={pieData2} options={pieOptions} />
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </div>
      <div className="d-flex ms-2 me-2">
        <Card
          className="w-100"
          style={{
            backgroundColor: "#0A7FB2",
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
                Risk Assessment / Recovery Strategy{" "}
                <span className="ms-2">
                  <FontAwesomeIcon icon={faArrowsRotate} />
                </span>
              </div>
            </Col>
          </Card.Body>
        </Card>
      </div>
      <div className=" d-flex justify-content-evenly ">
        <Card className="reportChart-cards  " style={{ width: "19%" }}>
          <Card.Body>
            <Row className="d-flex align-items-center justify-content-evenly mb-2 fs-4">
              {" "}
              RA & Recovery Strategy
            </Row>
            <Row className="mt-3">
              <Col className="text-center">
                <FontAwesomeIcon icon={faPlusCircle} size="2x" />
              </Col>
              <Col className="text-center">
                <h1>6572</h1>
              </Col>
              <Col className="text-center">
                <FontAwesomeIcon icon={faFileShield} size="2x" />
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* <Card className="reportChart-cards w-50">
          <Card.Body>
            <Row className="d-flex align-items-center justify-content-evenly mb-2 fs-4">
              {" "}
              RA & Recovery Strategy by Rating
            </Row>
            <Row className="mt-3 d-flex align-items-center justify-content-evenly ms-6">
              <Col>
                High{" "}
                <span
                  className="d-inline-block rounded ms-1"
                  style={{
                    width: "12px",
                    height: "12px",
                    backgroundColor: "red",
                  }}
                ></span>
              </Col>

              <Col>
                {" "}
                Medium{" "}
                <span
                  className="d-inline-block rounded ms-1"
                  style={{
                    width: "12px",
                    height: "12px",
                    backgroundColor: "#FFFF00",
                  }}
                ></span>
              </Col>
              <Col>
                Low{" "}
                <span
                  className="d-inline-block rounded ms-1"
                  style={{
                    width: "12px",
                    height: "12px",
                    backgroundColor: "#8BFF16",
                  }}
                ></span>
              </Col>
            </Row>
            <Row className="mt-3 d-flex align-items-center justify-content-evenly ms-6">
              <Col>
                <h1>34</h1>{" "}
              </Col>
              <Col>
                {" "}
                <h1>34</h1>{" "}
              </Col>
              <Col>
                <h1>34</h1>{" "}
              </Col>
            </Row>
          </Card.Body>
        </Card> */}
        <Card className="reportChart-cards w-50">
          <Card.Body>
            <div className="text-center fs-4 mb-2">Exercises by Status</div>

            <Table
              style={{
                width: "100%",
                textAlign: "center",
                borderCollapse: "collapse",
              }}
            >
              <tbody className="">
                <tr>
                  <td className="border-bottom-0">
                    {" "}
                    High{" "}
                    <span
                      className="d-inline-block rounded ms-1"
                      style={{
                        width: "12px",
                        height: "12px",
                        backgroundColor: "red",
                      }}
                    ></span>
                  </td>

                  <td
                    className="border-bottom-0 "
                    style={{ borderLeft: "2px solid black" }}
                  >
                    Medium{" "}
                    <span
                      className="d-inline-block rounded ms-1"
                      style={{
                        width: "12px",
                        height: "12px",
                        backgroundColor: "#FFFF00",
                      }}
                    ></span>
                  </td>
                  <td
                    className="border-bottom-0"
                    style={{ borderLeft: "2px solid black" }}
                  >
                    Low{" "}
                    <span
                      className="d-inline-block rounded ms-1"
                      style={{
                        width: "12px",
                        height: "12px",
                        backgroundColor: "#8BFF16",
                      }}
                    ></span>
                  </td>
                </tr>

                <tr>
                  <td className="border-bottom-0">
                    <h1>354</h1>
                  </td>

                  <td
                    className="border-bottom-0"
                    style={{ borderLeft: "2px solid black" }}
                  >
                    <h1>234</h1>
                  </td>
                  <td
                    className="border-bottom-0"
                    style={{ borderLeft: "2px solid black" }}
                  >
                    <h1>734</h1>
                  </td>
                </tr>
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </div>
      <div className="d-flex ms-2 me-2">
        <Card
          className="w-100"
          style={{
            backgroundColor: "#FC4979",
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
                Business Continuity Planning{" "}
                <span className="ms-2">
                  <FontAwesomeIcon icon={faUserLarge} />
                </span>
              </div>
            </Col>
          </Card.Body>
        </Card>
      </div>
      <div className=" d-flex justify-content-evenly ">
        <Card className="reportChart-cards  " style={{ width: "19%" }}>
          <Card.Body>
            <Row className="d-flex align-items-center justify-content-evenly mb-2 fs-4">
              {" "}
              Business Continuity Plan
            </Row>
            <Row className="mt-3">
              <Col className="text-center">
                <FontAwesomeIcon icon={faPlusCircle} size="2x" />
              </Col>
              <Col className="text-center">
                <h1>756</h1>
              </Col>
              <Col className="text-center">
                <FontAwesomeIcon icon={faFileShield} size="2x" />
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Card className="reportChart-cards ms-1" style={{ width: "30%" }}>
          <Card.Body className="d-flex align-items-center justify-content-between">
            <div
              style={{
                flex: "1 1 auto",
                maxWidth: "40%",
                marginTop: "-30px",
              }}
            >
              <Doughnut data={pieData3} options={pieOptions3} />
            </div>

            <div style={{ flex: "1 1 auto", maxWidth: "50%" }}>
              {pieData3.labels.map((label, index) => (
                <div key={index} className="d-flex align-items-center mb-2">
                  <div
                    style={{
                      width: "22px",
                      height: "22px",
                      backgroundColor:
                        pieData3.datasets[0].backgroundColor[index],
                      marginRight: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "4px",
                    }}
                  >
                    <span
                      style={{
                        color: "white",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      {pieData3.datasets[0].data[index]}
                    </span>
                  </div>
                  <span style={{ whiteSpace: "", fontSize: "14px" }}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>
        <Card className="reportChart-cards  " style={{ width: "19%" }}>
          <Card.Body>
            <Row className="d-flex align-items-center justify-content-evenly mb-2 fs-4">
              {" "}
              BCP by Frequency
            </Row>
            <Row className="mt-3">
              <Table bordered className="m-0">
                <thead className="border-top-0  border-start-0 border-end-0 ">
                  <tr className="border-top-0 border-start-0 border-end-0 border ">
                    <th>Frequency</th>
                    <th># Count</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="fw-bold">Annual</td>
                    <td>3</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Biennal</td>
                    <td>4</td>
                  </tr>
                </tbody>
              </Table>
            </Row>
          </Card.Body>
        </Card>
        <Card className="reportChart-cards  " style={{ width: "25%" }}>
          <Card.Body>
            <Bar data={barData} options={barOptions} />
          </Card.Body>
        </Card>
      </div>
      <div className="d-flex ms-2 me-2">
        <Card
          className="w-100"
          style={{
            backgroundColor: "#CBFC59",
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
                Exercises
                <span className="ms-2">
                  <FontAwesomeIcon icon={faSquareCheck} />
                </span>
              </div>
            </Col>
          </Card.Body>
        </Card>
      </div>
      <div className=" d-flex justify-content-between ms-4">
        <Card className="reportChart-cards  " style={{ width: "19%" }}>
          <Card.Body>
            <Row className="d-flex align-items-center justify-content-evenly mb-2 fs-4">
              {" "}
              Exercises
            </Row>
            <Row className="mt-3">
              <Col className="text-center">
                <FontAwesomeIcon icon={faPlusCircle} size="2x" />
              </Col>
              <Col className="text-center">
                <h1>562</h1>
              </Col>
              <Col className="text-center">
                <FontAwesomeIcon icon={faFileShield} size="2x" />
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Card className="reportChart-cards   ms-1" style={{ width: "35%" }}>
          <Card.Body>
            <div className="text-center fs-4 mb-2">Exercises by Status</div>
            {/* <Row className="align-items-stret">
              <Col md={8} className="h-100"> */}
            <Table
              style={{
                width: "100%",
                textAlign: "center",
                borderCollapse: "collapse",
              }}
            >
              <tbody className="">
                <tr>
                  <td className="border-bottom-0">Active</td>

                  <td
                    className="border-bottom-0 "
                    style={{ borderLeft: "2px solid black" }}
                  >
                    Closed
                  </td>
                  <td
                    className="border-bottom-0"
                    style={{ borderLeft: "2px solid black" }}
                  >
                    New
                  </td>
                  <td
                    className="border-bottom-0"
                    style={{ borderLeft: "2px solid black" }}
                  >
                    Cancelled
                  </td>
                </tr>

                <tr>
                  <td className="border-bottom-0">
                    <h1>354</h1>
                  </td>

                  <td
                    className="border-bottom-0"
                    style={{ borderLeft: "2px solid black" }}
                  >
                    <h1>234</h1>
                  </td>
                  <td
                    className="border-bottom-0"
                    style={{ borderLeft: "2px solid black" }}
                  >
                    <h1>734</h1>
                  </td>
                  <td
                    className="border-bottom-0"
                    style={{ borderLeft: "2px solid black" }}
                  >
                    <h1>56</h1>
                  </td>
                </tr>
              </tbody>
            </Table>
            {/* </Col>
            </Row> */}
          </Card.Body>
        </Card>
        <Card className="reportChart-cards ms-1" style={{ width: "20%" }}>
          <Card.Body>
            <Row className="align-items-stretch">
              <Col className="d-flex align-items-center justify-content-center">
                <Doughnut data={pieData4} options={pieOptions4} />
              </Col>
            </Row>
          </Card.Body>
        </Card>
        <Card className="reportChart-cards   ms-1" style={{ width: "20%" }}>
          <Card.Body>
            <div className="text-center fs-4 mb-2">
              Plan By Exercises Status{" "}
            </div>

            <Table
              style={{
                width: "100%",
                textAlign: "center",
                borderCollapse: "collapse",
              }}
            >
              <tbody className="">
                <tr>
                  <td className="border-bottom-0 ">Recovered</td>
                  <td
                    className="border-bottom-0"
                    style={{ borderLeft: "2px solid black" }}
                  >
                    Un-Recovered
                  </td>
                </tr>

                <tr>
                  <td className="border-bottom-0">
                    <h1>354</h1>
                  </td>

                  <td
                    className="border-bottom-0"
                    style={{ borderLeft: "2px solid black" }}
                  >
                    <h1>234</h1>
                  </td>
                </tr>
              </tbody>
            </Table>
            {/* </Col>
            </Row> */}
          </Card.Body>
        </Card>
      </div>
      {/* <Row>
        <Col xl={4} lg={4} md={4} sm={6}>
          {location?.state?.objectData?.type === "Process" && (
            <ReportRuntime
              report="GL_PROCESS_DETAILS"
              drilldownReports={{ objectId: location?.state?.objectData?.id }}
            />
          )}
          {location?.state?.objectData?.type === "Asset" && (
            <ReportRuntime
              report="GL_ASSET_DETAILS"
              drilldownReports={{ objectId: location?.state?.objectData?.id }}
            />
          )}
        </Col>

        <Col className="gx-4 mt-1">
          <Card className="reportChart-cards">
            <Card.Body>
              <div className="row text-center">
                <div className="col-md-3 border-end">
                  <h5>BIA</h5>
                  <div className="display-6">{biaCount}</div>
                </div>
                <div className="col-md-3 border-end">
                  <h5>Recovery Strategies</h5>
                  <div className="display-6">{raCount}</div>
                </div>
                <div className="col-md-3 border-end">
                  <h5>BCP</h5>
                  <div className="display-6">{bcpCount}</div>
                </div>
                <div className="col-md-3">
                  <h5>Exercises</h5>
                  <div className="display-6">{exerciseCount}</div>
                </div>
              </div>
            </Card.Body>
          </Card>
          <Col className="gx-4">
            <Card className="reportChart-cards">
              <Card.Body>
                <div className="row text-center">
                  <div className="col-md-3 border-end">
                    <h5>RTO (Minutes)</h5>
                    <div className="display-6">{impactRating?.rto}</div>
                  </div>
                  <div className="col-md-3 border-end">
                    <h5>RPO (Minutes)</h5>
                    <div className="display-6">{impactRating?.rpo}</div>
                  </div>
                  <div className="col-md-3 border-end">
                    <h5>WRT (Minutes)</h5>
                    <div className="display-6">{impactRating?.wrt}</div>
                  </div>
                  <div className="col-md-3 ">
                    <h5>MTD (Minutes)</h5>
                    <div className="display-6">{impactRating?.mtd}</div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Col>
      </Row>

      <Row>
        <Col xl={6} lg={6} md={6} sm={6}>
          <div>
            <ReportRuntime
              report="BR_BIA_PROCESS_REPORT"
              drilldownReports={{
                processName: location?.state?.objectData?.id,
              }}
            />
          </div>
        </Col>
        <Col xl={6} lg={6} md={6} sm={6}>
          <div>
            <ReportRuntime
              report="BR_RA_PROCESS_REPORT"
              drilldownReports={{
                processName: location?.state?.objectData?.id,
              }}
            />
          </div>
        </Col>
      </Row>
      <Row>
        <Col xl={6} lg={6} md={6} sm={6}>
          <div>
            <ReportRuntime
              report="BR_BCP_PROCESS_ASSET"
              drilldownReports={{
                processAsset: location?.state?.objectData?.bia_id,
              }}
            />
          </div>
        </Col>
        <Col xl={6} lg={6} md={6} sm={6}>
          <div>
            <ReportRuntime
              report="BR_EXERCISE_REPORT"
              drilldownReports={{
                bcpId: location?.state?.objectData?.bia_id,
              }}
            />
          </div>
        </Col>
      </Row> */}
    </>
  );
};

// export default Configuration;

let BR_BIA = ({ privs, yearProp }) => {
  return (
    <div className="">
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
          </div>
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
                <ReportRuntime report="BR_RA_RECOVERY_STRATEGY" />
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
            <ReportRuntime report="BR_BCP_LIST_RPT" />
          </Row>
          <Row id="scrollspyHeading1" className="ms-1 me-1">
            <Chart chart="BR_BC_PLAN_BY_STATUS" />
          </Row>
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
            <ReportRuntime report="BR_ACTIVE_EXCERCISES" />
          </Row>

          <Row id="scrollspyHeading1">
            <Col>
              {" "}
              <Chart chart="BR_PLANS_BY_EXERCISE_RESULTS" />
            </Col>
            <Col>
              {" "}
              <Chart chart="BR_PLANS_BY_EXERCISE_STATUS" />
            </Col>
          </Row>

          <Row id="scrollspyHeading1">
            <Col>
              <Chart chart="BR_EXERCISE_BY_STATUS" />
            </Col>
            <Col>
              <Chart chart="IR_BR_ISSUE_BY_STATUS" />
            </Col>
          </Row>
          <Row id="scrollspyHeading1" className="ms-1 me-1">
            <Chart chart="BR_EXERCISE_BY_DATE" />
          </Row>
        </>
      )}
    </div>
  );
};
