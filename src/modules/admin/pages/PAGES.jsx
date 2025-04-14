import ReportRuntime from "src/components/reports/Report";
import Pages from "src/components/forms/reactformutils/FormRuntimeEngine";
import OffCanvasForm from "src/components/pages/OffCanvasNew";
import Chart from "src/components/charts/Chart";
import { Row, Col } from "react-bootstrap";

let Page = () => {
  return (
    <>
      <div className="ms-auto text-end mb-4 me-0">
        <OffCanvasForm
          component={<Pages formService="pages" offCanvas objectId={-1} />}
          title="Pages"
        />
      </div>
      <Row>
        <ReportRuntime report="PAGES_REPORT" />
      </Row>
    </>
  );
};

export default Page;
