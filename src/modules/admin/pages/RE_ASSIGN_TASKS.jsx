import ReportRuntime from "src/components/reports/Report";

import Roles from "src/components/forms/reactformutils/FormRuntimeEngine";
import OffCanvasForm from "src/components/pages/OffCanvasNew";
import Chart from "src/components/charts/Chart";
import { Row, Col } from "react-bootstrap";

let ReAssignTask = () => {
  return (
    <>
      <Row>
        <ReportRuntime report="REASSIGN_TASK" />
      </Row>
    </>
  );
};

export default ReAssignTask;
