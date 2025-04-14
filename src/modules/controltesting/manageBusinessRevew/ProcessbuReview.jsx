import React from "react";
import { Helmet } from "react-helmet-async";
import { Container, Card, OverlayTrigger, Tooltip } from "react-bootstrap";
import ReportRuntime from "src/components/reports/Report";
import { Row, Col, Tabs,Tab,Nav } from "react-bootstrap";
import Chart from "src/components/charts/Chart";
import LandingPagesTitle from "src/components/pages/LandingPagesTitle";
import { util } from "src/Progrec";
import { useSearchParams, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ProcessbuReview = ({ objectId }) => {
    let privs = util.getCurrentUser().privileges?.split(",");
    const framework=2
    let userId = JSON.parse(localStorage.current_logged_User)[0].user_details
    .data[0].user_id;
  const { t } = useTranslation("common");
    return (
      <>
        <Helmet title="Control Testing" />
        <Container fluid className="p-0 ">
          
          {/* <FormReportChartLink combinedItems={combinedItems} /> */}
          <Row id="scrollspyHeading1">
            <Col>
              <ReportRuntime report="CT_ON_GOING_SEFT_ASSESSMENT"  drilldownReports={{ frameworkID: framework }} />
            </Col>
          </Row>
  
          <Row id="scrollspyHeading1">
            <Col className="p-0 m-0">
                <ReportRuntime report="GL_PROCESS" dataCard  />
              </Col>
              <Col className="p-0 m-0">
                <ReportRuntime report="GL_ORPHAN_PROCESS" dataCard  />
              </Col>
              
            <Col className="p-0 m-0">
                <ReportRuntime report="GL_CONTROL" dataCard  />
              </Col>
              <Col className="p-0 m-0">
                <ReportRuntime report="GL_ORPHAN_CONTROLS" dataCard  />
              </Col>
              {/* <Row>
              <Col >
              <ReportRuntime report="CT_CONTROLS_BY_PROCESS_BU" dataCard drilldownReports={{ objectId: userId }}/>
                </Col>
              </Row> */}
            </Row>
                
            <LandingPagesTitle title={t("Compliance Review Assessments")} />
          <Row className="h-25 ">
            <Col className="mb-0">
            <Row id="scrollspyHeading1">
            <Col className="p-0 m-0">
                  <ReportRuntime report="CT_BUSINESS_OVERALL-ASSESSMENT" dataCard drilldownReports={{ frameworkID: framework }}/>
                </Col>
            </Row>
              <Row id="scrollspyHeading1">
                <Col className="p-0 m-0">
                  <ReportRuntime report="CT_CONTROL_TESTING_BUSINESS_FINDINGS"   dataCard drilldownReports={{ frameworkID: framework }} />
                </Col>
                <Col className="p-0 m-0">
                  <ReportRuntime report="CT_CONTROL_TEST_FINDINGS_BUSINESS_OBJ" dataCard  drilldownReports={{ frameworkID: framework }} />
                </Col>
              </Row>
            </Col>
          </Row>
          {privs.includes("CT_CREATE_TEST_EXECUTION") && (
            <Row id="scrollspyHeading1">
              <Col xs={3} md={3} lg={3} >
                <Chart chart="CT_CONTROL_COMPLIANCE_STATUS_SELF"  defaultFilter={{processId: framework}} customExpressionFlag/>
              </Col>
              <Col lg={9}>
                <Chart chart="CT_BU_SELF_ASS_COMPLIANCE_STATUS"   defaultFilter={{processId: framework}} customExpressionFlag/>
              </Col>
              
            </Row>
          )}
          
        </Container>
      </>
    );
  }

  export default ProcessbuReview;