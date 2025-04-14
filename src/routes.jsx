import React from "react";
import { lazy } from "@loadable/component";
// Layouts
import AuthLayout from "./layouts/Auth";
import DashboardLayout from "./layouts/Dashboard";
import LandingLayout from "./layouts/Landing";
// Guards
import AuthGuard from "./components/guards/AuthGuard";
import { admin, adminForms } from "./modules/admin/router";
import {engine, engineForms } from "./modules/engine/router";

// import { timesheet, timesheetForms } from "./modules/timesheet/router";
// Auth
const Page500 = lazy(() => import("./pages/auth/Page500"));
const Page404 = lazy(() => import("./pages/auth/Page404"));
const SignIn = lazy(() => import("./pages/auth/SignIn"));
const SignUp = lazy(() => import("./pages/auth/SignUp"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
// Protected routes
const ProtectedPage = lazy(() => import("./pages/protected/ProtectedPage"));
const Tasks = lazy(() => import("./modules/admin/pages/Tasks"));
//Engine Pages
const FormRuntimeEngine = lazy(() =>
  import("./components/forms/reactformutils/FormRuntimeEngine")
);
const ReportRuntimeEngine = lazy(() => import("./components/reports/Report"));
const ChartRuntimeEngine = lazy(() => import("./components/charts/Chart"));
const PageRuntimeEngine = lazy(() =>
  import("./components/pages/PageRuntimeEngine")
);
//Menu Navigation
const DashboardNavigation = lazy(() =>
  import("./components/navigation/DashboardNavigation")
);
const CircularNavigation = lazy(() =>
  import("./components/navigation/CircularMenu")
);
const routes = [
  {
    path: "/",
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: "",
        element: <Tasks />,
      },
      {
        path: "pages/tasks",
        element: <Tasks />,
      },

      {
        path: "DashboardNavigation",
        element: <DashboardNavigation />,
      },
      {
        path: "CircularNavigation",
        element: <CircularNavigation />,
      },
    ],
  },
  // timesheet,
  admin,
  engine,
  {
    path: "report",
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: "",
        element: <ReportRuntimeEngine />,
      },
    ],
  },
  {
    path: "chart",
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: "",
        element: <ChartRuntimeEngine />,
      },
    ],
  },
  {
    path: "form",
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      // ...timesheetForms,
      ...adminForms,
      ...engineForms,
      {
        path: "runtime",
        element: <FormRuntimeEngine />,
      },
    ],
  },
  {
    path: "page",
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: "",
        element: <PageRuntimeEngine />,
      },
    ],
  },

  {
    path: "auth",
    element: <AuthLayout />,
    children: [
      {
        path: "sign-in",
        element: <SignIn />,
      },
      {
        path: "sign-up",
        element: <SignUp />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
      {
        path: "404",
        element: <Page404 />,
      },
      {
        path: "500",
        element: <Page500 />,
      },
    ],
  },

  {
    path: "private",
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: "",
        element: <ProtectedPage />,
      },
    ],
  },
  {
    path: "*",
    element: <AuthLayout />,
    children: [
      {
        path: "*",
        element: <Page404 />,
      },
    ],
  },
];

export default routes;
