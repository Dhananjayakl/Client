import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import Chart from "src/components/charts/Chart";
import ReportRuntime from "src/components/reports/Report";

const ProcessRiskAssessment = ({ objectId }) => {
  return (
    <Row className="p-0 m-0">
      <Col className="p-0 m-0">
        <ReportRuntime
          report="GL_RISK_BY_PROCESS_ID"
          drilldownReports={{ processId: objectId }}
          dataCard
        />
      </Col>
      <Col className="p-0 m-0">
        <ReportRuntime
          report="RA_RISK_ASS_BY_PROCESS"
          drilldownReports={{ processId: objectId }}
          dataCard
        />
      </Col>
      <Col className="p-0 m-0">
        <ReportRuntime
          report="RA_OVER_DUE"
          drilldownReports={{ processId: objectId }}
          dataCard
        />
      </Col>
      <Row className="p-0 m-0">
        <Col>
          <Chart
            chart="RA_RA_RISK_RESIDUAL_RATINGS"
            defaultFilter={{ processId: objectId }}
          />
        </Col>
        <Col>
          <Chart
              chart="RA_HEAT_MAP_PROCESS"
              defaultFilter={{ processId: objectId }}
            />
        </Col>
      </Row>

      <ReportRuntime
        report="RA_PROCESS_RISK_RPT"
        drilldownReports={{ processId: objectId }}
      />

      <ReportRuntime
        report="RA_RISK_ASSESMENTS_BY_PROCESS"
        drilldownReports={{ processId: objectId }}
      />
    </Row>
  );
};

export default ProcessRiskAssessment;
