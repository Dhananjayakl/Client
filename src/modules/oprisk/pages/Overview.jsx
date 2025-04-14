import React from "react";
import ReportRuntime from "src/components/reports/Report";
import { Row, Col, Tab, Table } from "react-bootstrap";
import Chart from "src/components/charts/Chart";
import * as util from "src/components/forms/reactformutils/elements/formutilfunctions";

const Overview = ({ year, refreshCharts }) => {
  let currentUserInfo = {
    logInId: util.getCurrentUser().id,
    privileges: util.getCurrentUser().privileges.split(","),
  };

  const isOrmAdmin = currentUserInfo.privileges.includes("RM_VIEW_ADMIN_SETUP");
  console.log(isOrmAdmin, "isOrmAdmin");
  return (
    <div>
      {isOrmAdmin && (
        <Row>
          <Col md={6}>
            <ReportRuntime
              report="LE_TRIAGE_INTERNAL_LOSS_EVENT"
              yearProp={year}
            />
          </Col>
          <Col md={6}>
            <ReportRuntime report="IR_TRIAGE_ISSUES" yearProp={year} />
          </Col>
        </Row>
      )}

      <Row>
        <Col md={6}>
          <ReportRuntime report="RM_TOP_5_LOSS_EVENTS" yearProp={year} />
        </Col>
        <Col md={6}>
          <ReportRuntime report="CSR_TOP_FIVE_RISK" yearProp={year} />
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Chart
            chart="RM_LOSS_BY_BASEL_CATEGORY"
            key={refreshCharts}
            yearProp={year}
            yearFlag
            customExpressionFlag
          />
        </Col>
        <Col md={6}>
          <Chart
            chart="GL_RISK_BY_CATEGORY"
            key={refreshCharts}
            yearProp={year}
            yearFlag
            customExpressionFlag
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <ReportRuntime report="CSR_TOP_FIVE_PROCESS" yearProp={year} />
        </Col>
        <Col md={6}>
          <ReportRuntime report="CSR_TOP_FIVE_CONTROL" yearProp={year} />
        </Col>
      </Row>

      <Row>
        {isOrmAdmin && (
          <Row>
            <ReportRuntime report="RA_ON_GOING_RISK_ASSESSMENT" />
          </Row>
        )}
        {!isOrmAdmin && (
          <Row>
            <ReportRuntime report="RA_ON_GOING_ASSESSMENT" />
          </Row>
        )}
      </Row>
      {/* <Row>
        <ReportRuntime report="BR_EXERCISE_LIST_REPORT" />
      </Row> */}
    </div>
  );
};

export default Overview;
