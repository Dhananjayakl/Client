import ReportRuntime from "src/components/reports/Report";

import LeaveConfiguration from "src/components/forms/reactformutils/FormRuntimeEngine";
import OffCanvasForm from "src/components/pages/OffCanvasNew";

let Document = () => {
  return (
    <>
      <div className="ms-auto text-end mb-4 me-0">
        <OffCanvasForm
          component={
            <LeaveConfiguration
              formService="leaveConfiguration"
              objectId={-1}
            />
          }
          title="Leave Policy"
        />
      </div>

      <ReportRuntime report="LM_LEAVEE_CONFIGURATION_SETUP" />
    </>
  );
};

export default Document;
