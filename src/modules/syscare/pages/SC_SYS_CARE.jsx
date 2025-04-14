import ReportRuntime from "src/components/reports/Report";

import { Row, Col, Container } from "react-bootstrap";

import { Helmet } from "react-helmet-async";
import LandingPagesTitle from "src/components/pages/LandingPagesTitle";

let PlatformLicense = () => {
  return (
    <>
      {/* <div className="ms-auto text-end mb-4 me-0">
        <OffCanvasForm
          component={<SysCare formService="syscare" objectId={-1} />}
          title="Schedule Maintenance"
        />
      </div> */}

      <Helmet title="Schedule Maintenance" />
      <Container fluid className="p-0 ">
        <LandingPagesTitle
          title="Schedule Maintenance"
          // configurationForm="biaconfigurationsetup"
          // privileges="BR_SETUP_BR"
        />
        <Row>
          {/* <Col xs={6} lg={3}>
          <Chart chart="SC_SYSCARE_REASON" />
        </Col> */}
          <Col>
            <ReportRuntime report="SC_SCHEDULE_MAINTENANCE" dataCard />
          </Col>
        </Row>
        <ReportRuntime report="SC_SCHEDULE_MAINTENANCE" />
      </Container>
    </>
  );
};

export default PlatformLicense;
