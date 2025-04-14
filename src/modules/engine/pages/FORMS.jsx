// import React from "react";

// import LandingPage, {
//   ActionButtons,
// } from "src/components/pages/OneObjectLandingPage";
// import { getObjectData, deleteObject } from "../EngineService";
// import FormComponent from "../forms/FormDesigner";
// import { useNavigate } from "react-router-dom";
// import { Play } from "react-feather";
// let service = "forms";
// let navigationPath = "/form/formdesigner";

// const RunForm = ({ formName }) => {
//   let navigate = useNavigate();
//   const withoutslashFormName = formName.replace(/\//g, "");

//   return (
//     <a
//       variant="light"
//       className="mx-2 text-dark"
//       size="sm"
//       // onClick={() => navigate(`/report?report=${reportName}`)}
//       onClick={() =>
//         navigate(`/form/runtime?formService=${withoutslashFormName}`)
//       }
//     >
//       <Play />
//     </a>
//   );
// };

// const tableColumns = [
//   {
//     Header: "Run",
//     Cell: ({ row }) => <RunForm formName={row.original.apiHandler} />,
//     disableFilters: true,
//     minWidth: 10,
//     width: 20,
//   },
//   {
//     Header: "Actions",
//     Cell: ({ row }) => (
//       <ActionButtons
//         row={row}
//         id={row.original.formId}
//         service={service}
//         component={<FormComponent id={row.original.formId} />}
//         deleteObject={deleteObject}
//         navigationPath={`${navigationPath}?id=${row.original.formId}`}
//       />
//     ),
//     disableFilters: true,
//   },
//   {
//     Header: "Title",
//     accessor: "formTitle",
//   },
//   {
//     Header: "Name",
//     accessor: "formName",
//   },
//   {
//     Header: "Purpose",
//     accessor: "purpose",
//   },
//   {
//     Header: "Module",
//     accessor: "moduleId",
//   },
//   {
//     Header: "Api Handler",
//     accessor: "apiHandler",
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
//       title="Forms"
//       newFormLabel="Add Form"
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
import Forms from "../forms/FormDesigner";
import { Row, Col, Button } from "react-bootstrap";
import { DndContext } from "@dnd-kit/core";

let Form = () => {
  const navigate = useNavigate();
  return (
    <>
      <Row className="m-0 p-0">
        <Col>
          <Button
            onClick={() => {
              navigate(`/form/formdesigner`);
            }}
            className="float-end mb-2"
          >
            + Add Form
          </Button>
        </Col>
      </Row>

      <Row className="m-0 p-0">
        <Col>
          <ReportRuntime report="FORMS" />
        
     
        </Col>
      </Row>
    </>
  );
};

export default Form;
