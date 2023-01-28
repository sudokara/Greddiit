import React from "react";
import { Navigate } from "react-router-dom";

const RequireAuth = ({ children, redirectTo }) => {
  const isAuthenticated = localStorage.getItem("MIICXAIBAAKBgQCXGAO6Lh9QhTHDMa1T") === "UV51D7fGZIR8fW6KpEGCFRQ+ae2AjXQj";
  return isAuthenticated ? children : <Navigate to={redirectTo} />;
};

export default RequireAuth;
