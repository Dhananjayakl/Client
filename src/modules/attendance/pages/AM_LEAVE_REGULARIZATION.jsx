import ReportRuntime from "src/components/reports/Report";

import AttendanceRegularization from "src/components/forms/reactformutils/FormRuntimeEngine";
import OffCanvasForm from "src/components/pages/OffCanvasNew";

let Regularization = () => {
  let validationFlag = true;
  return (
    <>
      <div className="ms-auto text-end mb-4 me-0">
        <OffCanvasForm
          component={
            <AttendanceRegularization
              validationFlag={validationFlag}
              formService="regularization"
              objectId={-1}
            />
          }
          title="Attendance Regularization"
        />
      </div>

      <ReportRuntime report="AM_REGULARIZATION" />
    </>
  );
};

export default Regularization;
