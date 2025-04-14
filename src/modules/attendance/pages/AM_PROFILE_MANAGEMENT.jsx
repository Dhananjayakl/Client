import ReportRuntime from "src/components/reports/Report";
import Profile from "src/components/forms/reactformutils/FormRuntimeEngine";
import OffCanvasForm from "src/components/pages/OffCanvasNew";

let ProfileManagement = () => {
  return (
    <>
      <div className="ms-auto text-end mb-4 me-0">
        <OffCanvasForm
          component={<Profile formService="profile" objectId={-1} offCanvas />}
          title="Profile Management"
        />
      </div>
      <ReportRuntime report="AM_PROFILE_MANAGEMENT" />
      {/* <ReportRuntime
          report="ATTENDANCE_RECORD"
        /> */}
    </>
  );
};

export default ProfileManagement;
