import React from "react";
import { Helmet } from "react-helmet-async";
import { Container, Card, OverlayTrigger, Tooltip } from "react-bootstrap";
import ReportRuntime from "src/components/reports/Report";
import { Row, Col, Tabs,Tab,Nav } from "react-bootstrap";
import Chart from "src/components/charts/Chart";
import LandingPagesTitle from "src/components/pages/LandingPagesTitle";
import { useSearchParams, useLocation, useNavigate } from "react-router-dom";
import { util } from "src/Progrec";
import { useTranslation } from "react-i18next";


const ReportingObligationBusinessreview = ({ objectId }) => {
    let privs = util.getCurrentUser().privileges?.split(",");
    const { t } = useTranslation("common");
    return (
      <>
        <Helmet title="Control Testing" />
        <Container fluid className="p-0 ">
          {/* <FormReportChartLink combinedItems={combinedItems} /> */}
          <LandingPagesTitle title={t("Reporting Obligations")} />
  
          <Row id="scrollspyHeading1">
            <ReportRuntime report="CT_REPORTING_OBLIGATIONS" dataCard />
          </Row>
  
          <Row id="scrollspyHeading1">
            <Col xs={12} md={6} lg={6}>
              <Chart chart="CT_OBLIGATION_TASK_BY_CATEGORY" />
            </Col>
            <Col xs={12} md={6} lg={6}>
              <Chart chart="CT_OBLIGATION_COMPLETION_STATUS" />
            </Col>
          </Row>
          <Row className="" id="scrollspyHeading1">
                <div>
                  <Col>
                    <Chart chart="CT_OBLIGATION_BY_SOURCE" />
                  </Col>
                  <Col>
                    <Chart chart="CT_OBLIGATION_TASKS_BY_DUE" />
                  </Col>
                </div>
              </Row>
        </Container>
      </>
    );
  }


  export default ReportingObligationBusinessreview;