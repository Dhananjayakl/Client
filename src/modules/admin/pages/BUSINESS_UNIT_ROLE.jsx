import ReportRuntime from "src/components/reports/Report";

import BusinessUnitRole from "src/components/forms/reactformutils/FormRuntimeEngine";
import OffCanvasForm from "src/components/pages/OffCanvasNew";
import Chart from "src/components/charts/Chart";
import { Row, Col } from "react-bootstrap";

let BuniessUnit = () => {
  return (
    <>
      <div className="ms-auto text-end mb-4 me-0">
        <OffCanvasForm
          component={
            <BusinessUnitRole
              formService="createbusinessunitrolepair"
              objectId={-1}
              offCanvas
            />
          }
          title="Create Pair"
        />
      </div>
      <Row>
        <ReportRuntime report="BUSINESS_UNIT_ROLE_USER" />
      </Row>
    </>
  );
};

export default BuniessUnit;
