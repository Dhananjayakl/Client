// import React from "react";

// import FormComponent from "../forms/WorkflowDesigner";
// import LandingPage, {
//   ActionButtons,
// } from "src/components/pages/OneObjectLandingPage";
// import { getObjectData, deleteObject } from "../EngineService";

// let service = "designWorkflow";
// let navigationPath = "/form/workflowdesigner";

// const tableColumns = [
//   {
//     Header: "Actions",
//     Cell: ({ row }) => (
//       <ActionButtons
//         row={row}
//         id={row.original.workflowId}
//         service={service}
//         component={<FormComponent id={row.original.workflowId} />}
//         deleteObject={deleteObject}
//         navigationPath={`${navigationPath}?id=${row.original.workflowId}`}
//       />
//     ),
//     disableFilters: true,
//   },
//   {
//     Header: "Code",
//     accessor: "workflowCode",
//   },
//   {
//     Header: "title",
//     accessor: "workflowTitle",
//   },
//   {
//     Header: "Version",
//     accessor: "version",
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
//       title="Workflows"
//       newFormLabel="Add Workflow"
//       service={service}
//       component={<FormComponent />}
//       tableColumns={tableColumns}
//       getObjectData={getObjectData}
//       navigationPath={navigationPath}
//     />
//   );
// };

// export default Default;

import ReportRuntime from "src/components/reports/Report";

import { useNavigate } from "react-router-dom";

import { Row, Col, Button } from "react-bootstrap";
let Workflow = () => {
  const navigate = useNavigate();

  return (
    <>
      <Row className="m-0 p-0">
        <Col>
          <Button
            onClick={() => {
              navigate(`/form/workflowdesigner`);
            }}
            className="float-end mb-2"
          >
            + Add Workflow
          </Button>
        </Col>
      </Row>
      <Row className="m-0 p-0">
        <Col>
          <ReportRuntime report="WORKFLOWS" />
        </Col>
      </Row>
    </>
  );
};

export default Workflow;
