import React from "react";
import { useContext } from "react";
import useAuth from "../hooks/useAuth";

export const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}> {children} </AuthContext.Provider>;
};

export default AuthProvider;
