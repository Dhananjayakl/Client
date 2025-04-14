import React from "react";
import { lazy } from "@loadable/component";
import DashboardLayout from "../../layouts/Dashboard";
// Guards
import AuthGuard from "../../components/guards/AuthGuard";
// Forms

const ChangePassword = lazy(() =>
  import("./forms/ChangePassword")
);

// const ModuleInfoPage = lazy(() => import("./pages/MODULE_INFO"));
const Tasks = lazy(() => import("./pages/Tasks"));
const Uploads = lazy(() => import("./pages/UPLOADS"));
//Charts
let admin = {
  path: "pages",
  element: (
    <AuthGuard>
      <DashboardLayout />{" "}
    </AuthGuard>
  ),
  children: [
    {
      path: "tasks",
      element: <Tasks />,
    },
    {
      path: "upload",
      element: <Uploads />,
    },
  ],
  path: "page",
  element: (
    <AuthGuard>
      <DashboardLayout />{" "}
    </AuthGuard>
  ),
  // children: [
  //   {
  //     path: "moduleInfo/:id",
  //     element: <ModuleInfoPage />,
  //   },
  // ],
};

const adminForms = [

  {
    path: "changepwd",
    element: <ChangePassword />,
  },
];

export { admin, adminForms };
