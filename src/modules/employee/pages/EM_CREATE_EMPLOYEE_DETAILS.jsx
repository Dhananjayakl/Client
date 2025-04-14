import ReportRuntime from "src/components/reports/Report";
import Chart from "src/components/charts/Chart";
import { Col, Row } from "react-bootstrap";

let EmployeeDetail = () => {
  return (
    <>
      <Row style={{ marginTop: "20px" }}>
        <Col xs={4} md={4} lg={6}>
          <Chart chart="EM_EMPLOYEES_DEPT" />
        </Col>
        <Col xs={4} md={4} lg={6}>
          <Chart chart="EM_EMPLOYEE_JOIN_RESIGN" />
        </Col>
      </Row>
      <Row style={{ marginTop: "20px" }}>
        <Col xs={4} md={4} lg={12}>
          <Chart chart="EM_EMPLOYEES_EXP" />
        </Col>
      </Row>
      <Row style={{ marginTop: "20px" }}>
        <Col xs={6} md={4} lg={6}>
          <Chart chart="EM_SKILLS_CHART" />
        </Col>
        <Col xs={6} md={4} lg={6}>
          <Chart chart="EM_CERT_CHART" />
        </Col>
      </Row>

      <ReportRuntime report="EM_EMPLOYEE_DETAILS_RPT" />
    </>
  );
};

export default EmployeeDetail;
