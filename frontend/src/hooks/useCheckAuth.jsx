import React, { useEffect, useState } from "react";
import axios from "../api/axios";

const useCheckAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkLogin = async () => {
    try {
      const response = await axios.get("/auth/check", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            "Greddiit-access-token"
          )}`,
        },
      });
      if (response.status === 200) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch (err) {
      console.error(err);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => checkLogin(), []);

  return isLoggedIn;
};

export default useCheckAuth;
