import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import Chart from "src/components/charts/Chart";
import ReportRuntime from "src/components/reports/Report";

const ProcessIssues = ({ objectId }) => {
  return (
    <>
      <Row className="p-0 m-0">
        <Col className="p-0 m-0" md={4}>
          <ReportRuntime
            report="IR_GL_ISSUE_DETAILS"
            drilldownReports={{ processId: objectId }}
            dataCard
          />
        </Col>
        {/* <Col className="p-0 m-0">
            <ReportRuntime
              report="IR_PROCESS_ISSUE_BY_DUEDATE"
              drilldownReports={{ processId: objectId }}
              dataCard
            />
          </Col> */}
      </Row>
      <Row className="p-0 m-0">
        <Col md={3}>
          <Chart
            chart="IR_PROCESS_ISSUES_BY_CATEGORY"
            defaultFilter={{ processId: objectId }}
          />
        </Col>
        <Col md={3}>
          <Chart
            chart="IR_PROCESS_ISSUE_BY_PRIORITY"
            defaultFilter={{ processId: objectId }}
          />
        </Col>
        <Col md={6}>
          <Chart
            chart="IR_PROCESS_ISSUE_BY_STATUS"
            defaultFilter={{ processId: objectId }}
          />
        </Col>
        {/* <Col>
            <Chart
              chart="IR_PROCESS_ISSUE_BY_STATUS"
              defaultFilter={{ processId: objectId }}
            />
          </Col> */}
      </Row>
    </>
  );
};

export default ProcessIssues;
