import React from "react";
import { Helmet } from "react-helmet-async";
import { Container, Row, Col } from "react-bootstrap";
import Header from "./Header";
// import LeaveTable from "./leaveTable.jsx";
import Statistics from "./Statistics";
import { Dashboard, EmployeeDept, EmployeeEvents } from "./HRLeaveDashboard";
import ReportRuntime from "src/components/reports/Report";
import Chart from "src/components/charts/Chart";
const Default = () => {
  const userData = JSON.parse(localStorage.current_logged_User);
  const hrView = userData.some((user) =>
    user.user_details.data[0].role_names.includes("HR_Admin")
  );
  return (
    <React.Fragment>
      <Helmet title="Leave Management" />
      <Container fluid className="pb-5">
        <Header />
        <Row>
          <Col lg="5" className="d-flex ">
            <Statistics />
          </Col>
          <Col lg="7" className="d-flex  pb-4 ">
            <Chart chart="LM_LEAVES_BY_MONTH" />
          </Col>
          <ReportRuntime report="LM_LEAVE_REQUEST" />
        </Row>

        {hrView && (
          <Row>
            <h3>Monthly Leave Analysis</h3>
            <Col xs={4} md={4} lg={5}>
              <Dashboard />
              <EmployeeEvents />
            </Col>
            <Col lg="7" className="d-flex ">
              <Chart chart="LM_LEAVES_BY_DEPT" />
            </Col>
          </Row>
        )}
      </Container>
    </React.Fragment>
  );
};

export default Default;
