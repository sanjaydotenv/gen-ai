import { createBrowserRouter, redirect } from "react-router-dom";
import { store } from "../store/index.js";
import { logoutUser, refreshSession } from "../store/slices/authSlice.js";
import AppLayout from "../components/AppLayout.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import RegisterPage from "../pages/RegisterPage.jsx";
import DashboardPage from "../pages/DashboardPage.jsx";

export async function rootLoader() {
  const state = store.getState().auth;
  if (state.loading) {
    await store.dispatch(refreshSession());
  }
  return null;
}

export function guestLoader() {
  if (store.getState().auth.user) {
    return redirect("/dashboard");
  }
  return null;
}

export function protectedLoader() {
  if (!store.getState().auth.user) {
    return redirect("/login");
  }
  return null;
}

export async function logoutAction() {
  await store.dispatch(logoutUser());
  return redirect("/login");
}

export const router = createBrowserRouter([
  {
    id: "root",
    element: <AppLayout />,
    loader: rootLoader,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
        loader: guestLoader,
      },
      {
        path: "/register",
        element: <RegisterPage />,
        loader: guestLoader,
      },
      {
        element: <ProtectedRoute />,
        loader: protectedLoader,
        children: [
          {
            path: "/dashboard",
            element: <DashboardPage />,
          },
        ],
      },
      {
        path: "/logout",
        action: logoutAction,
      },
      {
        path: "*",
        loader: () => redirect(store.getState().auth.user ? "/dashboard" : "/login"),
      },
    ],
  },
]);
