import React from "react";
import LoginPage from "../login";
import { Outlet } from "react-router-dom";

export default function PrivateRoute(children) {
  const isAuthenticated = localStorage.getItem("access_token");
  if (!!isAuthenticated) {
    return <Outlet />;
  }
  return <LoginPage />;
}
