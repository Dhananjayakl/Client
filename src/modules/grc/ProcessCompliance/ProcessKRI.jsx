import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import Chart from "src/components/charts/Chart";
import ReportRuntime from "src/components/reports/Report";

const ProcessKRI = ({ objectId }) => {
  return (
    <Row className="p-0 m-0">
      <Row>
        <Col className="p-0 m-0" md={4}>
          <ReportRuntime
            report="GL_KRI_BY_PROCESS_ID"
            drilldownReports={{ processId: objectId }}
            dataCard
          />
        </Col>
        {/* <Col className="p-0 m-0" md={3}>
            <ReportRuntime
              report="GL_KRI_APPLICABILITY_BY_PROCESS"
              drilldownReports={{ processId: objectId }}
              dataCard
            />
          </Col> */}

        <Col className="p-0 m-0" md={4}>
          <ReportRuntime
            report="GL_KRI_PENDING_REVIEW"
            drilldownReports={{ processId: objectId }}
            dataCard
          />
        </Col>
        <Col className="p-0 m-0" md={4}>
          <ReportRuntime
            report="GL_KRI_OVERDUE"
            drilldownReports={{ processId: objectId }}
            dataCard
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <Chart
            chart="GL_KRI_BY_THRESHOLD"
            defaultFilter={{ processId: objectId }}
          />
        </Col>
        <Col>
          <Chart
            chart="GL_KRI_FREQUENCY_BY_PROCESS"
            defaultFilter={{ processId: objectId }}
          />
        </Col>
        <Col>
          <Chart
            chart="GL_KRI_BY_CATEGORY"
            defaultFilter={{ processId: objectId }}
          />
        </Col>

        {/* <Col>
            <Chart
              chart="GL_OWNERSHIP_OVERVIEW"
              defaultFilter={{ processId: objectId }}
            />
          </Col> */}
      </Row>
      {/* <Row>
          <ReportRuntime
            report="GL_KRI_BY_PROCESS"
            drilldownReports={{ processId: objectId }}
          />
        </Row> */}
      <Row>
        <Col>
          <Chart
            chart="GL_KRI_TREND_CHART"
            defaultFilter={{ processId: objectId }}
          />
        </Col>
        {/* <Col>
            <Chart
              chart="GL_KRI_TRENDS"
              // defaultFilter={{ processId: objectId }}
              // key={refreshCharts}
              // yearProp={yearStr}
            />
          </Col> */}
      </Row>
    </Row>
  );
};

export default ProcessKRI;
