import ReportRuntime from "src/components/reports/Report";
import WorkHourManagement from "src/components/forms/reactformutils/FormRuntimeEngine";
import OffCanvasForm from "src/components/pages/OffCanvasNew";

let workHour = () => {
  return (
    <>
      <div className="ms-auto text-end mb-4 me-0">
        <OffCanvasForm
          component={
            <WorkHourManagement formService="workhour" offCanvas objectId={-1} />
          }
          title="Work Hour Management"
        />
      </div>
      <ReportRuntime report="AM_WORK_HOUR_MANAGMENT" />
    </>
  );
};

export default workHour;
