import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
// import LoginPage from "./pages/auth/LoginPage";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LoginPage />,
    },
    {
      path: "/register",
      element: <RegisterPage />,
    },
    // {
    //   path: "/dashboard",
    //   element: <DashboardPage />,
    // },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
