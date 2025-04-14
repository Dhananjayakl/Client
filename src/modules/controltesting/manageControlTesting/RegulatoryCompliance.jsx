import React from "react";
import { Helmet } from "react-helmet-async";
import { Container, Card, OverlayTrigger, Tooltip } from "react-bootstrap";
import ReportRuntime from "src/components/reports/Report";
import { Row, Col, Tabs,Tab,Nav } from "react-bootstrap";
import Chart from "src/components/charts/Chart";
import LandingPagesTitle from "src/components/pages/LandingPagesTitle";
import { useSearchParams, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const RegulatoryCompliance = ({ objectId }) => {
    const [searchParams] = useSearchParams();
    const d_source = searchParams.get("d_source");
    let userId = JSON.parse(localStorage.current_logged_User)[0].user_details
    .data[0].user_id;
  
    const framework=1
    const { t } = useTranslation("common");
  
    return (
      <>
        <Helmet title="Control Testing" />
        <Container fluid className="p-0 ">
          <div
            data-bs-spy="scroll"
            data-bs-target="#navbar-example2"
            data-bs-offset="0"
            class="scrollspy-example mt-3"
            tabindex="0"
          >
            <Row id="scrollspyHeading1">
              <Col>
                <ReportRuntime report="CT_ON_GOING_TEST_EXE"   drilldownReports={{ frameworkID: framework }} />
              </Col>
            </Row>
            <Row id="scrollspyHeading1">
            <Col className="p-0 m-0">
                <ReportRuntime report="GL_REQUIREMENT" dataCard  />
              </Col>
              <Col className="p-0 m-0">
                <ReportRuntime report="GL_ORPHAN_REQUIREMENT" dataCard  />
              </Col>
            <Col className="p-0 m-0">
                <ReportRuntime report="GL_CONTROL" dataCard  />
              </Col>
              <Col className="p-0 m-0">
                <ReportRuntime report="GL_ORPHAN_CONTROLS" dataCard  />
              </Col>
            </Row>
           <LandingPagesTitle title={t("Compliance Review Assessments")} />
  
            <Row id="scrollspyHeading1">
              <ReportRuntime
                report="CT_COMPLIANCE_OVERALL_ASSESSMENTS"
                dataCard drilldownReports={{ frameworkID: framework }}
              />
  
              
            </Row>
            <Row id="scrollspyHeading1">
              <Col className="p-0 m-0">
                <ReportRuntime report="CT_CONTROL_TEST_FINDINGS" dataCard drilldownReports={{ frameworkID: framework }} />
              </Col>
              <Col className="p-0 m-0">
                <ReportRuntime report="CT_CONTROL_TEST_FINDINGS_OBS" dataCard drilldownReports={{ frameworkID: framework }}/>
              </Col>
            </Row>
              <Row id="scrollspyHeading1">
                {/* <Col xs={12} md={6} lg={4}>
                  <Chart chart="CT_CONTROL_BY_PRIORITY" />
                </Col> */}
                <Col xs={12} md={6} lg={4}>
                  <Chart chart="CT_COMPLIANCE_STATUS_KEY_CONTROL_CHT" defaultFilter={{processId: framework}} customExpressionFlag/>
                </Col>
                <Col xs={12} md={6} lg={4}>
                  <Chart chart="CT_OVERALL_CONTROL_STATUS"  defaultFilter={{processId: framework}} customExpressionFlag/>
                </Col>
                <Col xs={12} md={6} lg={4}>
                          <Chart chart="CT_CCO_HEAT_MAP_REQUIREMENT" />
                </Col>
              </Row>
              <Row>
                
                <Col >
                  <Chart chart="GL_REQUIREMENT_BY_COMPLIANCE_TYPE"  />
                </Col>
              </Row>
              <Row>
              <Col md={6}>
                <ReportRuntime report="CT_EFFECTIVE_CONTROLS"  drilldownReports={{ frameworkID: framework }} />
              </Col>
              <Col md={6}>
                <ReportRuntime report="CT_WEAK_CONTROL"  drilldownReports={{ frameworkID: framework }} />
              </Col>
              </Row>
          </div>
        </Container>
      </>
    );
  };


  export default RegulatoryCompliance;