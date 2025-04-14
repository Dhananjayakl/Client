import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import Chart from "src/components/charts/Chart";
import ReportRuntime from "src/components/reports/Report";

const ProcessTestExecutions = ({ objectId }) => {
  return (
    <>
      <Row className=" p-0 m-0 justify-content space-around">
        <Col className="p-0 m-0">
          <ReportRuntime
            report="GL_CONTROLS_BY_PROCESS_ID"
            drilldownReports={{ processId: objectId }}
            dataCard
          />
        </Col>
        <Col className="p-0 m-0">
          <ReportRuntime
            report="CT_TEST_EXECUTIONS_BY_PROCESS"
            drilldownReports={{ processId: objectId }}
            dataCard
          />
        </Col>
        <Col className="p-0 m-0">
          <ReportRuntime
            report="CT_OVER_DUE"
            drilldownReports={{ processId: objectId }}
            dataCard
          />
        </Col>
      </Row>

      <Row className=" p-0 m-0 justify-content space-around">
        <Col lg={5}>
          <Chart
            chart="CT_COMPLIANCE_STATUS"
            defaultFilter={{ processId: objectId }}
          />
        </Col>
      </Row>
      <Row className=" p-0 m-0 justify-content space-around">
        <ReportRuntime
          report="CT_PROCESS_CONTROL_RPT"
          drilldownReports={{ processId: objectId }}
        />
      </Row>
      <Row className=" p-0 m-0 justify-content space-around">
        <ReportRuntime
          report="CT_TEST_EXECUTIONS_BY_PROCESS"
          drilldownReports={{ processId: objectId }}
        />
      </Row>
    </>
  );
};

export default ProcessTestExecutions;
