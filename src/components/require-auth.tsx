import React from 'react';
import { Navigate } from "react-router-dom";

const RequireAuth = ({ children }: { children: React.JSX.Element }) => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RequireAuth;
