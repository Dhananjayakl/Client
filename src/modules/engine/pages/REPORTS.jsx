// import React from "react";

// import FormComponent from "../forms/WorkflowDesigner";
// import LandingPage, {
//   ActionButtons,
// } from "src/components/pages/OneObjectLandingPage";
// import { getObjectData, deleteObject } from "../EngineService";
// import { useNavigate } from "react-router-dom";

// let service = "reportdesigner";
// let navigationPath = "/form/reportdesigner";

// import { Play } from "react-feather";

// const RunReport = ({ reportName }) => {
//   let navigate = useNavigate();
//   return (
//     <a
//       variant="light"
//       className="mx-2 text-dark"
//       size="sm"
//       onClick={() => navigate(`/report?report=${reportName}`)}
//     >
//       <Play />
//     </a>
//   );
// };

// const tableColumns = [
//   {
//     Header: "Run",
//     Cell: ({ row }) => <RunReport reportName={row.original.reportName} />,
//     disableFilters: true,
//     minWidth: 10,
//     width: 20,
//   },
//   {
//     Header: "Actions",
//     Cell: ({ row }) => (
//       <ActionButtons
//         row={row}
//         id={row.original.reportId}
//         service={service}
//         component={<FormComponent id={row.original.reportId} />}
//         deleteObject={deleteObject}
//         navigationPath={`${navigationPath}?id=${row.original.reportId}`}
//       />
//     ),
//     disableFilters: true,
//   },
//   {
//     Header: "Name",
//     accessor: "reportName",
//   },
//   {
//     Header: "title",
//     accessor: "reportTitle",
//   },
//   {
//     Header: "Active",
//     accessor: (d) => {
//       return d.active ? "Yes" : "No";
//     },
//   },
//   {
//     Header: "Module",
//     accessor: "moduleId",
//   },
//   // {
//   //   Header: "History",
//   //   Cell: ({ row }) => {
//   //     return (
//   //       <>
//   //         <div>
//   //           {row.original.createdBy} - {row.original.createdOn}
//   //         </div>
//   //         <div>
//   //           {row.original.lastUpdatedBy} - {row.original.lastUpdatedOn}
//   //         </div>
//   //       </>
//   //     );
//   //   },
//   // },
// ];

// const Default = () => {
//   return (
//     <LandingPage
//       title="Reports"
//       newFormLabel="Add Report"
//       service={service}
//       component={<FormComponent />}
//       tableColumns={tableColumns}
//       getObjectData={getObjectData}
//       navigationPath={navigationPath}
//     />
//   );
// };

// export default Default;

// import ReportRuntime from "src/components/reports/Report";

// import { useNavigate } from "react-router-dom";

// import { Row, Col, Button } from "react-bootstrap";

// let Reports = () => {
//   const navigate = useNavigate();

//   return (
//     <>
//       <Button
//         onClick={() => {
//           navigate(`/form/reportdesigner`);
//         }}
//         className="float-end"
//       >
//         + Add Report
//       </Button>

//       <Row>
//         <ReportRuntime report="REPORTS" />
//       </Row>
//     </>
//   );
// };

// export default Reports;

import ReportRuntime from "src/components/reports/Report";
import { useNavigate } from "react-router-dom";
import { Row, Col, Button } from "react-bootstrap";

let Reports = () => {
  const navigate = useNavigate();

  return (
    <>
      <Row className="m-0 p-0">
        <Col>
          <Button
            onClick={() => {
              navigate(`/form/reportdesigner`);
            }}
            className="float-end mb-2"
          >
            + Add Report
          </Button>
        </Col>
      </Row>

      <Row className="m-0 p-0">
        <Col>
          <ReportRuntime report="REPORTS" />
        </Col>
      </Row>
    </>
  );
};

export default Reports;
