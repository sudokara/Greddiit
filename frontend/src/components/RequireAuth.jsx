import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { axiosPrivate } from "../api/axios";
import Loading from "./Loading";

const RequireAuth = ({ children, redirectTo }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
      axiosPrivate
        .get("/api/auth/check")
        .then((response) => {
          // console.log(response);
          if (response.status === 200) {
            setIsAuthenticated(true);
            setIsLoading(false);
          }
        })
        .catch((err) => {
          setIsLoading(false);
          console.error(err);
        });
  }, []);

  if (isLoading) return <Loading/>;

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} />;
  }

  return children;
};

export default RequireAuth;
