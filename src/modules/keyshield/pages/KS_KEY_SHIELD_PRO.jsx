import ReportRuntime from "src/components/reports/Report";
import { Helmet } from "react-helmet-async";

import {Container} from "react-bootstrap";
import KeyShieldPro from "src/components/forms/reactformutils/FormRuntimeEngine";

import OffCanvasForm from "src/components/pages/OffCanvasNew";
import LandingPagesTitle from "src/components/pages/LandingPagesTitle";

let PlatformLicense = () => {
  return (
    <>
      {/* <div className="ms-auto text-end mb-4 me-0">
        <OffCanvasForm
          component={<KeyShieldPro formService="licenses" objectId={-1} />}
          title="Platform Licensing"
        />
      </div> */}
      <Helmet title="Platform Licensing" />
      <Container fluid className="p-0 ">
        <LandingPagesTitle
          title="Platform Licensing"
          // configurationForm="biaconfigurationsetup"
          // privileges="BR_SETUP_BR"
        />

        <ReportRuntime report="KS_PLATFORM_LICENSE" />
      </Container>
    </>
  );
};

export default PlatformLicense;
