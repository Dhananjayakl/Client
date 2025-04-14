import ReportRuntime from "src/components/reports/Report";

import Roles from "src/components/forms/reactformutils/FormRuntimeEngine";
import OffCanvasForm from "src/components/pages/OffCanvasNew";
import Chart from "src/components/charts/Chart";
import { Row, Col } from "react-bootstrap";

let Role = () => {
  return (
    <>
      <div className="ms-auto text-end mb-4 me-0">
        {/* <h1 className="text-start">Business Unit & Role Pair</h1> */}
        <OffCanvasForm
          component={<Roles formService="roles" offCanvas objectId={-1} />}
          title="Roles"
        />
      </div>
      <Row>
        <ReportRuntime report="ROLES" />
      </Row>
    </>
  );
};

export default Role;
