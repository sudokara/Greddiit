import React, { useEffect, useState } from "react";
import { axiosPrivate } from "../api/axios";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("Greddiit-access-token");
    if (accessToken) {
      setAccessToken(accessToken);
      setIsAuthenticated(true);
    }
  }, []);

  const refreshAccessToken = async () => {
    try {
      const response = await axiosPrivate.post("/auth/refresh");

      //! check refresh
      console.log(response.data);
      const { accessToken } = response.data;
      localStorage.setItem("accessToken", accessToken);
      setAccessToken(accessToken);
    } catch (err) {
      console.error(err);
    }
  };

  const checkAuth = async () => {
    try {
      const response = await axios.get("/auth/check", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.status === 200) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error(error);
      setIsAuthenticated(false);
      refreshAccessToken();
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      checkAuth();
    }, 15 * 60 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, [accessToken]);

  return { isAuthenticated, accessToken, refreshAccessToken };
};

export default useAuth;
