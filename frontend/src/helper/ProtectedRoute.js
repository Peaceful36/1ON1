// ProtectedRoute.js (HOC for protecting routes)
import React from "react";
import { Navigate, Outlet, Route } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" />;
  return <Outlet />;
};

export default ProtectedRoute;
