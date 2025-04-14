import ReportRuntime from "src/components/reports/Report";

import Privileges from "src/components/forms/reactformutils/FormRuntimeEngine";
import OffCanvasForm from "src/components/pages/OffCanvasNew";
import Chart from "src/components/charts/Chart";
import { Row, Col } from "react-bootstrap";

let Privilege = () => {
  return (
    <>
      <div className="ms-auto text-end mb-4 me-0">
        {/* <h1 className="text-start">Business Unit & Role Pair</h1> */}
        <OffCanvasForm
          component={
            <Privileges formService="privileges" offCanvas objectId={-1} />
          }
          title="Privileges"
        />
      </div>
      <Row>
        <ReportRuntime report="PRIVILEGES" />
      </Row>
    </>
  );
};

export default Privilege;
