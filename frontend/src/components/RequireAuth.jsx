import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthProvider";

const RequireAuth = async ({ children, redirectTo }) => {
  const { isAuthenticated, refreshAccessToken } = useContext(AuthContext);
  
  if (!isAuthenticated) {
    await refreshAccessToken();
    return <div>Error refreshing token</div>
  }

  return isAuthenticated ? children : <Navigate to={redirectTo} />;
};

export default RequireAuth;
