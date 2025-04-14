import { Helmet } from "react-helmet-async";
import { Container } from "react-bootstrap";
import ReportRuntime from "src/components/reports/Report";
import { Row, Col } from "react-bootstrap";

import * as util from "src/components/forms/reactformutils/elements/formutilfunctions";
import FormLink from "src/components/pages/FormLink";
import LandingPagesTitle from "src/components/pages/LandingPagesTitle";
import FormReportChartLink from "src/components/pages/FormReportChartLink";
import Chart from "src/components/charts/Chart";

const Default = () => {
  let privs = util.getCurrentUser().privileges?.split(",");
  let forms = [];
  //   forms = [
  //     {
  //       title: "Create Ticket",
  //       form: "pmticket",
  //       privilege: "PM_CREATE_TICKET",
  //       upload: true,
  //     },
  //   ];

  //   let reports = [
  //     {
  //       title: "Open Ticket List",
  //       report: "PM_TICKET_LIST",
  //       privilege: "PM_VIEW_TICKET",
  //     },
  //     {
  //       title: "Reported By Me",
  //       report: "PM_TICKETS_REPORTED_BY_ME",
  //       privilege: "PM_VIEW_TICKET",
  //     },
  //     {
  //       title: "Closed Tickets List",
  //       report: "PM_CLOSED_TICKET",
  //       privilege: "PM_VIEW_TICKET",
  //     },
  //   ];

  //   const FormsandReport = () => {
  //     const combinedItems = [
  //       ...forms.map((item) => ({ ...item, type: "form" })),
  //       ...reports.map((item) => ({ ...item, type: "report" })),
  //       //   ...chart.map((item) => ({ ...item, type: "chart" })),
  //     ];

  //     return (
  //       <>
  //         <div>
  //           <FormReportChartLink combinedItems={combinedItems} />
  //         </div>
  //       </>
  //     );
  //   };

  return (
    <>
      <Helmet title="Monthly Attendance Summary and Regularization" />
      <Container fluid className="p-0 ">
        <div>
          <LandingPagesTitle
            title="Monthly Attendance Summary and Regularization"
            // configurationForm="biaconfigurationsetup"
            // privileges="BR_SETUP_BR"
          />
        </div>
        {/* <div className="row  row-cols-sm-1">
          <FormsandReport />
        </div> */}

        <div className="">
          {privs.includes("HR_Employee") && (
            <>
              <Row>
                <ReportRuntime report="AM_MONTHLY_ATTENDANCE_REP" />
              </Row>
              <Row>
                <ReportRuntime report="AM_REGURALIZATION_REQ_REP" />
              </Row>
            </>
          )}
        </div>
      </Container>
    </>
  );
};

export default Default;
