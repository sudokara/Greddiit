import React from "react";
import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Loading from "../components/Loading"
import axios from "../api/axios";

//@brief Return children if user is authenticated and navigate to redirectTo if unauthenticated
const RequireUnauth = ({ children, redirectTo }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("greddiit-access-token");
    console.log(token);
    if (token) {
      axios
        .get("/auth/check", {
          headers: { Authorization: "Bearer " + token },
        })
        .then((response) => {
          console.log(response);
          if (response.status === 200) {
            setIsAuthenticated(true);
            setIsLoading(false);
          }
        })
        .catch((err) => {
          setIsLoading(false);
          // console.error(err);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) return <Loading />;

  if (isAuthenticated) {
    return <Navigate to={redirectTo} />;
  }

  return children;
};

export default RequireUnauth;
