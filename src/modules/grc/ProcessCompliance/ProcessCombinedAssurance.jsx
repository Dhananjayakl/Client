import React, { useState, useEffect } from "react";
import Chart from "src/components/charts/Chart";
import { Row, Col } from "react-bootstrap";
import ReportRuntime from "src/components/reports/Report";
import ProcessHierarchy from "./ProcessHierarchy";

const ProcessCombinedAssurance = ({ objectId }) => {
  return (
    <Row id="scrollspyHeading1">
      <Row id="scrollspyHeading1">
        <Row className=" p-2 m-0 justify-content space-around">
          <Row>
            <Col className="p-0 ms-3">
              <h5>Relationship</h5>
            </Col>
          </Row>
          <Col className="p-0 m-0">
            <ReportRuntime
              report="GL_BUSINESSUNITS_BY_PROCESS_ID"
              drilldownReports={{ processId: objectId }}
              dataCard
            />
          </Col>
          <Col className="p-0 m-0">
            <ReportRuntime
              report="GL_RISK_BY_PROCESS_ID"
              drilldownReports={{ processId: objectId }}
              dataCard
            />
          </Col>
          <Col className="p-0 m-0">
            <ReportRuntime
              report="GL_CONTROLS_BY_PROCESS_ID"
              drilldownReports={{ processId: objectId }}
              dataCard
            />
          </Col>
          <Col className="p-0 m-0">
            <ReportRuntime
              report="GL_RELATED_ASSET_BY_ID"
              drilldownReports={{ processId: objectId }}
              dataCard
            />
          </Col>
          <Col className="p-0 m-0">
            <ReportRuntime
              report="GL_RELATED_THIRDPARTY_BY_ID"
              drilldownReports={{ processId: objectId }}
              dataCard
            />
          </Col>
          <Col className="p-0 m-0">
            <ReportRuntime
              report="GL_RELATED_SOP_BY_ID"
              drilldownReports={{ processId: objectId }}
              dataCard
            />
          </Col>
        </Row>
        <Row className="ms-2">
          <hr></hr>
        </Row>

        <Row
          className=" p-2 m-0 justify-content space-around"
          id="scrollspyHeading1"
        >
          <Col className="p-0 m-0">
            <ReportRuntime
              report="CT_TEST_EXECUTIONS_BY_PROCESS"
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
              report="BR_BIA_BY_PROCESS_ID"
              drilldownReports={{ processId: objectId }}
              dataCard
            />
          </Col>
          <Col className="p-0 m-0">
            <ReportRuntime
              report="VM_PRODUCT_SERVICE_BY_PROCESS_ID"
              drilldownReports={{ processId: objectId }}
              dataCard
            />
          </Col>
          <Col className="p-0 m-0">
            <ReportRuntime
              report="IR_GL_ISSUE_DETAILS"
              drilldownReports={{ processId: objectId }}
              dataCard
            />
          </Col>
        </Row>

        <Row className=" p-2 m-0 justify-content space-around">
          <Col id="scrollspyHeading1" lg={6}>
            <ReportRuntime
              report="GL_PROCESS_INFO_BY_ID"
              drilldownReports={{ processId: objectId }}
            />
            {/* <ReportRuntime
                report="IR_GL_ISSUE_DETAILS"
                drilldownReports={{ processId: objectId }}
                dataCard
              /> */}
          </Col>
          <Col lg={6}>
            <ProcessHierarchy objectId={objectId} />
          </Col>
        </Row>
        <Row className=" p-2 m-0 justify-content space-around">
          <Col md={6}>
            <Chart
              chart="CT_COMPLIANCE_STATUS"
              defaultFilter={{ processId: objectId }}
            />
          </Col>
          <Col md={6}>
            <Chart
                chart="RA_HEAT_MAP_PROCESS"
                defaultFilter={{ processId: objectId }}
              />
          </Col>
        </Row>
        <Row className=" p-2 m-0 justify-content space-around">
          <ReportRuntime
            report="CT_PROCESS_CONTROL_RPT"
            drilldownReports={{ processId: objectId }}
          />
        </Row>
        <Row className=" p-2 m-0 justify-content space-around">
          <ReportRuntime
            report="RA_LATEST_RISK_REGISTRY_PROCESS"
            drilldownReports={{ processId: objectId }}
          />
        </Row>
        <Row className=" p-2 m-0 justify-content space-around">
          <ReportRuntime
            report="GL_RCM_DETAILS"
            drilldownReports={{ processId: objectId }}
          />
        </Row>
      </Row>
    </Row>
  );
};

export default ProcessCombinedAssurance;
