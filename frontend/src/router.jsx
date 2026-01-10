import { createBrowserRouter, Navigate } from "react-router";

import AppLayout from "./layouts/AppLayout.jsx";
import AuthLayout from "./layouts/AuthLayout.jsx";
import { redirectIfAuthenticated, requireAuth } from "@/lib/auth.js";

export const createRouter = (clerk) =>
  createBrowserRouter([
    {
      path: "",
      Component: AppLayout,
      loader: () => requireAuth(clerk),
      children: [
        {
          index: true,
          element: <Navigate to="/dashboard" replace />,
        },
        {
          path: "dashboard",
          lazy: () =>
            import("./pages/dashboard/index.jsx").then((module) => ({
              Component: module.default,
            })),
        },
        {
          path: "notes",
          lazy: () =>
            import("./pages/grades/index.jsx").then((module) => ({
              Component: module.default,
            })),
        },
        {
          path: "students",
          lazy: () =>
            import("./pages/students/index.jsx").then((module) => ({
              Component: module.default,
            })),
        },
        {
          path: "courses",
          lazy: () =>
            import("./pages/courses/index.jsx").then((module) => ({
              Component: module.default,
            })),
        },
        {
          path: "about",
          lazy: () =>
            import("./pages/about/index.jsx").then((module) => ({
              Component: module.default,
            })),
        },
        {
          path: "users",
          lazy: () =>
            import("./pages/users/index.jsx").then((module) => ({
              Component: module.default,
            })),
        },
      ],
    },
    {
      path: "login",
      Component: AuthLayout,
      loader: () => redirectIfAuthenticated(clerk),
      children: [
        {
          index: true,
          lazy: () =>
            import("./pages/auth/login.jsx").then((module) => ({
              Component: module.default,
            })),
        },
      ],
    },
  ]);
