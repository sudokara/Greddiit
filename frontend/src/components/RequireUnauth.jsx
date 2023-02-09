import React from "react";
import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Loading from "../components/Loading"
import { axiosPrivate } from "../api/axios";

//@brief Return children if user is authenticated and navigate to redirectTo if unauthenticated
const RequireUnauth = ({ children, redirectTo }) => {
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
          // console.error(err);
        });
  }, []);

  if (isLoading) return <Loading />;

  if (isAuthenticated) {
    return <Navigate to={redirectTo} />;
  }

  return children;
};

export default RequireUnauth;
