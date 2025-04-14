import ReportRuntime from "src/components/reports/Report";

import HolidayCalendar from "src/components/forms/reactformutils/FormRuntimeEngine";
import OffCanvasForm from "src/components/pages/OffCanvasNew";

let Document = () => {
  return (
    <>
      <div className="ms-auto text-end mb-4 me-0">
        <OffCanvasForm
          component={
            <HolidayCalendar formService="HolidaySetup" objectId={-1} />
          }
          title="Holiday"
        />
      </div>

      <ReportRuntime report="LM_HOLIDAY_CALENDAR" />
    </>
  );
};

export default Document;
