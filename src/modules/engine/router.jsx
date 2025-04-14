import React from "react";
import { lazy } from "@loadable/component";
import DashboardLayout from "../../layouts/Dashboard";
// Guards
import AuthGuard from "../../components/guards/AuthGuard";
// Forms
const FormDesigner = lazy(() => import("../engine/forms/FormDesigner"));
const WorkflowDesigner = lazy(() => import("../engine/forms/WorkflowDesigner"));
const ReportDesigner = lazy(() => import("../engine/forms/ReportDesigner"));

const ModuleInfoPage = lazy(() => import("./pages/MODULE_INFO"));

//Charts
const Charts = lazy(() => import("../engine/forms/ChartsDesigner"));
let engine = {
    
    path: "page",
    element: (
      <AuthGuard>
        <DashboardLayout />{" "}
      </AuthGuard>
    ),
    children: [
      {
        path: "moduleInfo/:id",
        element: <ModuleInfoPage />,
      },
    ],
  };

const engineForms = [
  {
    path: "formdesigner",
    element: <FormDesigner />,
  },
  {
    path: "workflowdesigner",
    element: <WorkflowDesigner />,
  },
  {
    path: "reportdesigner",
    element: <ReportDesigner />,
  },

  {
    path: "chartdesigner",
    element: <Charts />,
  },
 
];

export {engine, engineForms };
