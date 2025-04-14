import ReportRuntime from "src/components/reports/Report";
import Modules from "src/components/forms/reactformutils/FormRuntimeEngine";
import OffCanvasForm from "src/components/pages/OffCanvasNew";
import Chart from "src/components/charts/Chart";
import { Row, Col } from "react-bootstrap";

let ScheduleMaintenance = () => {
  return (
    <>
      {/* <div className="ms-auto text-end mb-4 me-0">
        <OffCanvasForm
          component={<Modules formService="modules" objectId={-1} />}
          title="modules"
        />
      </div> */}
      <Row>
        <ReportRuntime report="SCHEDULE_MAINTENANCE" />
      </Row>
    </>
  );
};

export default ScheduleMaintenance;
