import React, { useState, useEffect } from "react";
import { Container, Card, Row, Col } from "react-bootstrap";
import { faCakeCandles, faSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Chart from "src/components/charts/Chart";
import { getviewData } from "src/modules/leave/LeaveService";

export const Dashboard = () => {
  const [leaverequest, settotalRequest] = useState("");
  const [currentleaverequest, setcurrentleaverequest] = useState("");
  const [monthlyleaverequest, setmonthlyleaverequest] = useState("");

  const viewParams = {
    viewName: "pa_lm_leave_request_data_v",
    pageNumber: 0,
    pageSize: 0,
    sortField: "",
    sortOrder: "",
    orderExpression: "",
    filterExpression: "",
  };

  useEffect(() => {
    // if (formDate && untilDate && type) {
    getviewData(viewParams)
      .then((response) => {
        const leavedata = response.data;
        settotalRequest(leavedata.data[0].total_leave_reqs);
        setcurrentleaverequest(leavedata.data[0].current_leave_requests);
        setmonthlyleaverequest(leavedata.data[0].monthly_leave_requests);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <React.Fragment>
      <Container fluid className="pb-2">
        {/* <Card className="lg">
          <Card.Body>
            <table className="table me-2" style={{ marginBottom: "-3px" }}>
              <tbody>
                <tr className="h-100">
                  <td
                    className="border-bottom-0"
                    style={{ marginBottom: "-20px" }}
                  >
                    <div className="d-flex justify-content-center align-items-center">
                      <td style={{ color: "Tomato", fontSize: "15px" }}>
                        Leave Request
                      </td>
                    </div>
                  </td>
                  <td
                    className="border-bottom-0"
                    style={{ backgroundColor: "Tomato", fontSize: "15px" }}
                  >
                    <div>
                      <td className="text-white d-flex justify-content-center align-items-center">
                        {leaverequest}
                      </td>
                    </div>
                  </td>
                  <td className="border-bottom-0">
                    <div className="d-flex flex-column justify-content-center align-items-center">
                      <span
                        style={{
                          color: "DodgerBlue",
                          height: "100px",
                          fontSize: "15px",
                          marginLeft: "35px",
                        }}
                      >
                        Today
                      </span>
                      <span
                        style={{
                          color: "orchid",
                          fontSize: "15px",
                          marginLeft: "35px",
                        }}
                      >
                        This Month
                      </span>
                    </div>
                  </td>
                  <td
                    className="border-bottom-0"
                    style={{ marginRight: "-20px" }}
                  >
                    <div className="d-flex flex-column">
                      <td
                        className="text-white d-flex justify-content-center align-items-center"
                        style={{
                          backgroundColor: "DodgerBlue",
                          height: "100px",
                          fontSize: "20px",
                          marginTop: "-13px",
                        }}
                      >
                        {currentleaverequest}
                      </td>
                      <td
                        className="text-white d-flex justify-content-center align-items-center"
                        style={{
                          backgroundColor: "orchid",
                          height: "100px",
                          fontSize: "20px",
                          marginBottom: "-12px",
                        }}
                      >
                        {monthlyleaverequest}
                      </td>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </Card.Body>
        </Card> */}
        <div className="container bootstrap snippets bootdey">
          <div className="row">
            <ul className="notes">
              <li>
                <div className="rotate-1 lazur-bg">
                  <strong className="d-flex justify-content-end">
                    {new Date().toDateString()}
                  </strong>

                  <h4>Leave Request</h4>
                  <p>{leaverequest}</p>
                  <h4>Today</h4>
                  <p>{currentleaverequest}</p>
                  <h4>This Month</h4>
                  <p>{monthlyleaverequest}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        {/* <div className="card mb-3" style={{ height: "70px" }}>
                <div className="row g-0">

                    <div className="col-md-8">
                        <div className="card-body" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "70px" }}>
                            <h5 className="card-title" style={{ color: "tomato", fontSize: "20px" }}>Leave Allocation Requests</h5>
                        </div>
                    </div>
                    <div className="col-md-4 text-white" style={{ backgroundColor: "tomato", display: "flex", alignItems: "center", justifyContent: "center", height: "70px", fontSize: "20px" }}>
                        <span >5</span>
                    </div>
                </div>
            </div> */}
      </Container>
    </React.Fragment>
  );
};
export const EmployeeDept = () => (
  <React.Fragment>
    {/* <Container> */}
    {/* <div className="card mb-3 w-100"> */}
    <Row>
      <h3>Monthly Leave Analysis</h3>
      {/* <Col xs={6} md={4} lg={4} style={{ marginTop: "0px" }}>

                    <Chart chart="LEAVE_CHART" />
                </Col> */}
      {/* <Col >
                    <Chart chart="PA_LM_LEAVES_BY_DEPT" />
                </Col> */}
    </Row>
    {/* </div> */}
    {/* </Container> */}
  </React.Fragment>
);

export const EmployeeEvents = () => {
  const [dob, setdob] = useState([]);
  const [empname, setempname] = useState([]);
  const [birthDate, setbirthDate] = useState([]);

  const employeeView = {
    viewName: "pa_em_personal_details_bv",
    pageNumber: 0,
    pageSize: 0,
    sortField: "",
    sortOrder: "",
    orderExpression: "",
    // filterExpression:""
    filterExpression:
      "extract(day from date_of_birth) >= extract(day from current_date) and to_char(date_of_birth,'mm')=to_char(current_date,'mm')",
  };

  useEffect(() => {
    getviewData(employeeView)
      .then((response) => {
        const employeeData = response.data;
        const dobArray = [];
        const empnameArray = [];
        const birthdateArray = [];

        employeeData.data.forEach((employee) => {
          dobArray.push(employee.d_department);
          empnameArray.push(employee.d_user_id);
          birthdateArray.push(employee.date_of_birth);
        });
        setdob(dobArray);
        setempname(empnameArray);
        setbirthDate(birthdateArray);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <React.Fragment>
      <Row>
        <Col>
          <div className="card">
            <div
              className="card-header text-white w-100 d-flex justify-content-center align-items-center fs-3"
              style={{
                height: "50px",
                backgroundColor: "deepskyblue",
              }}
            >
              Upcoming Birthdays
            </div>
            {empname.length > 0 ? (
              <ul
                className="list-group list-group-flush overflow-auto"
                style={{ maxHeight: "250px" }}
              >
                {empname.map((name, index) => (
                  <li
                    key={index}
                    className="list-group-item d-flex  align-items-center"
                  >
                    <div
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        backgroundColor: "lightgray",
                        marginRight: "10px",
                      }}
                    >
                      <img
                        src="https://www.ihna.edu.au/blog/wp-content/uploads/2022/10/user-dummy.png"
                        // src="D:\HRMS\Client\src\assets\img\ProfileImages\1234.png"
                        alt="Profile"
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: "50%",
                        }}
                      />
                    </div>
                    <div className="ms-4 w-50">
                      <h6>{name}</h6>
                      <div>
                        <span className="">{dob[index]}</span>
                      </div>
                      <div>
                        <span>
                          {new Date(birthDate[index]).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric" }
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="ms-6 lg d-flex justify-content-end">
                      <div className="ms-6">
                        {" "}
                        <FontAwesomeIcon
                          icon={faCakeCandles}
                          size="lg"
                          color="deepskyblue"
                          className="ms-6  fa-2xl"
                        ></FontAwesomeIcon>{" "}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="card-body">
                <h3>No upcoming birthdays for employees.</h3>
              </div>
            )}
          </div>
        </Col>
      </Row>
      {/* <Col>
                        <div className="card" >
                            <div className="card-header text-white" style={{
                                height: "50px", fontSize: "20px", backgroundColor: "deepskyblue", width: "100%",
                                display: "flex", alignItems: "center", justifyContent: "center"
                            }}>
                                Upcoming Events
                            </div>
                            <ul className="list-group list-group-flush" style={{ maxHeight: "150px", overflow: "auto" }}>
                                <li className="list-group-item" style={{ borderBottom: "1px solid" }}><h4 style={{ marginBottom: "-7px" }}>Praveen B Desai</h4><span>R&D</span></li>
                                </ul>
                        </div>
                    </Col>
                    <Col>
                        <div className="card" >
                            <div className="card-header text-white" style={{
                                height: "50px", fontSize: "20px", backgroundColor: "deepskyblue", width: "100%",
                                display: "flex", alignItems: "center", justifyContent: "center"
                            }}>
                                Announcements
                            </div>
                            <ul className="list-group list-group-flush" style={{ maxHeight: "150px", overflow: "auto" }}>
                                <li className="list-group-item" style={{ borderBottom: "1px solid" }}><h4>Praveen B Desai</h4></li>
                                <li className="list-group-item" style={{ borderBottom: "1px solid" }}><h4>Praveen B Desai</h4></li>
                                <li className="list-group-item" style={{ borderBottom: "1px solid" }}><h4>Praveen B Desai</h4></li>
                                <li className="list-group-item" style={{ borderBottom: "1px solid" }}><h4>Praveen B Desai</h4></li>
                                <li className="list-group-item" style={{ borderBottom: "1px solid" }}><h4>Praveen B Desai</h4></li>
                            </ul>

                        </div>
                    </Col>
                </Row> */}
    </React.Fragment>
  );
};
