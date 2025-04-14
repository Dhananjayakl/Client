// import React from "react";

// import FormComponent from "../forms/ChartsDesigner";
// import LandingPage, {
//   ActionButtons,
// } from "src/components/pages/OneObjectLandingPage";
// import { getObjectData, deleteObject } from "../EngineService";
// import { useNavigate } from "react-router-dom";

// let service = "chartdesigner";
// let navigationPath = "/form/chartdesigner";

// import { Play } from "react-feather";

// const RunChart = ({ chartName }) => {
//   let navigate = useNavigate();
//   return (
//     <a
//       variant="light"
//       className="mx-2 text-dark"
//       size="sm"
//       onClick={() => navigate(`/chart?chart=${chartName}`)}
//     >
//       <Play />
//     </a>
//   );
// };

// const tableColumns = [
//   {
//     Header: "Run",
//     Cell: ({ row }) => <RunChart chartName={row.original.chartName} />,
//     disableFilters: true,
//     minWidth: 10,
//     width: 20,
//   },
//   {
//     Header: "Actions",
//     Cell: ({ row }) => (
//       <ActionButtons
//         row={row}
//         id={row.original.chartId}
//         service={service}
//         component={<FormComponent id={row.original.chartId} />}
//         deleteObject={deleteObject}
//         navigationPath={`${navigationPath}?id=${row.original.chartId}`}
//       />
//     ),
//     disableFilters: true,
//   },
//   {
//     Header: "Mod.",
//     accessor: "moduleId",
//     minWidth: 100,
//   },
//   {
//     Header: "title",
//     accessor: "chartTitle",
//     minWidth: 250,
//   },
//   {
//     Header: "chartType",
//     accessor: "chartType",
//   },

//   {
//     Header: "Form Name",
//     accessor: "formName",
//     minWidth: 250,
//   },
//   // {
//   //   Header: "Purpose",
//   //   accessor: "purpose",
//   //   minWidth:250
//   // },
//   {
//     Header: "data Source",
//     accessor: "dataSource",
//   },

//   // {
//   //   Header: "xColumn",
//   //   accessor: "xcolumn",
//   // },
//   // {
//   //   Header: "xTitle",
//   //   accessor: "xtitle",
//   // },
//   // {
//   //   Header: "xGrid",
//   //   accessor: (d) => {
//   //              return d.active ? "Yes" : "No";
//   //          },
//   // },
//   // {
//   //   Header: "xStack",
//   //   accessor: (d) => {
//   //       return d.xstack? "Yes" : "No";
//   //   },
//   // },
//   // {
//   //   Header: "yColumn",
//   //   accessor: "ycolumn",
//   // },
//   // {
//   //   Header: "yTitle",
//   //   accessor: "ytitle",
//   // },
//   // {
//   //   Header: "yGrid",
//   //   accessor: (d) => {
//   //       return d.ygrid ? "Yes" : "No";
//   //   },
//   // },
//   // {
//   //   Header: "yStack",
//   //   accessor: (d) => {
//   //       return d.ystack ? "Yes" : "No";
//   //   },
//   // },
//   // {
//   //   Header: "ySteps",
//   //   accessor: "ysteps",
//   // },

//   //   {
//   //     Header: "Active",
//   //     accessor: (d) => {
//   //       return d.active ? "Yes" : "No";
//   //     },
//   //   },

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
//       title="Chart Designer"
//       newFormLabel="Add Chart"
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

let Charts = () => {
  const navigate = useNavigate();

  return (
    <>
      <Row className="m-0 p-0">
        <Col>
          {" "}
          <Button
            onClick={() => {
              navigate(`/form/chartdesigner`);
            }}
            className="float-end mb-2"
          >
            + Add Chart
          </Button>
        </Col>
      </Row>{" "}
      <Row className="m-0 p-0">
        <Col>
          <ReportRuntime report="CHARTS" />
        </Col>
      </Row>{" "}
    </>
  );
};

export default Charts;
