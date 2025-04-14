import ReportRuntime from "src/components/reports/Report";

import JobScheduler from "src/components/forms/reactformutils/FormRuntimeEngine";
import OffCanvasForm from "src/components/pages/OffCanvasNew";

let JobSchedulers = () => {
  return (
    <>
      <div className="ms-auto text-end mb-4 me-0">
        <OffCanvasForm
          component={
            <JobScheduler formService="jobscheduler" objectId={-1} offCanvas />
          }
          title="Job Scheduler"
        />
      </div>

      <ReportRuntime report="JOB_SCHEDULER" />
    </>
  );
};

export default JobSchedulers;
