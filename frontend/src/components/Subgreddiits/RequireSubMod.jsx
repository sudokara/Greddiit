import { useState, useEffect } from "react";
import React from "react";
import { axiosPrivate } from "../../api/axios";
import Loading from "../Loading";
import { Navigate } from "react-router-dom";

const RequireSubMod = ({ subgr, children, redirectTo }) => {
  const [isSubMod, setIsSubMod] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axiosPrivate
      .get(`/api/gr/ismod/${subgr}`)
      .then((response) => {
        if (response.status === 200) {
          setIsSubMod(true);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        // console.error(err)
      });
  }, [subgr]);

  if (isLoading) return <Loading />;

  if (!isSubMod) {
    return <Navigate to={redirectTo} />;
  }
  
  return children;
};

export default RequireSubMod;
