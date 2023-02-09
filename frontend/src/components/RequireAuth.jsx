import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "../api/axios";
import Loading from "./Loading";

const RequireAuth = ({ children, redirectTo }) => {
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
          console.error(err);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) return <Loading/>;

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} />;
  }

  return children;
};

export default RequireAuth;
