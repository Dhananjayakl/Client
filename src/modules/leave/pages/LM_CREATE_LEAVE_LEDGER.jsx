import ReportRuntime from "src/components/reports/Report";

import LeaveLedger from "src/components/forms/reactformutils/FormRuntimeEngine";
import OffCanvasForm from "src/components/pages/OffCanvasNew";
import Chart from "src/components/charts/Chart";
import { Row, Col } from "react-bootstrap";

let Skills = () => {
  return (
    <>
      <div className="ms-auto text-end mb-4 me-0">
        <OffCanvasForm
          component={<LeaveLedger formService="leaveledger" objectId={-1} />}
          title="Leave Ledger"
        />
      </div>
      <Row>
        <ReportRuntime report="LM_LEAVE_LEDGER_REPORT" />
      </Row>
    </>
  );
};

export default Skills;
