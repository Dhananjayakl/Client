import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import Chart from "src/components/charts/Chart";
import ReportRuntime from "src/components/reports/Report";

const ProcessVendorTP = ({ objectId }) => {
  return (
    <Row className="p-0 m-0">
      <Row>
        <Col className="p-0 m-0" md={3}>
          <ReportRuntime
            report="GL_RELATED_THIRDPARTY_BY_ID"
            drilldownReports={{ processId: objectId }}
            dataCard
          />
        </Col>
        <Col className="p-0 m-0" md={3}>
          <ReportRuntime
            report="VM_THIRDPARTY_RELATED_PRODUCT_SERVICE"
            drilldownReports={{ processId: objectId }}
            dataCard
          />
        </Col>
      </Row>

      <Row className=" p-0 m-0 justify-content space-around">
        <Col lg={5}>
          <Chart
            chart="GL_THIRDPARTY_BY_CATEGORY"
            defaultFilter={{ processId: objectId }}
          />
        </Col>
        <Col lg={5}>
          <Chart
            chart="GL_THIRDPARTY_BY_CRITICALITY"
            defaultFilter={{ processId: objectId }}
          />
        </Col>
      </Row>
      <Row>
        <ReportRuntime
          report="GL_GL_THIRDPARTY_VENDOR_REGISTRY"
          drilldownReports={{ processId: objectId }}
        />
      </Row>
    </Row>
  );
};

export default ProcessVendorTP;
