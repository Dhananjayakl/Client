import ReportRuntime from "src/components/reports/Report";

import References from "src/components/forms/reactformutils/FormRuntimeEngine";
import OffCanvasForm from "src/components/pages/OffCanvasNew";

let Reference = () => {
  return (
    <>
      <div className="ms-auto text-end mb-4 me-0">
        <OffCanvasForm
          component={<References formService="references" objectId={-1} />}
          title="References"
        />
      </div>

      <ReportRuntime report="EM_REFERENCES" />
    </>
  );
};

export default Reference;
