import React from "react";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";

const Authorize = () => {
  const navigate = useNavigate();

  if (
    localStorage.getItem("MIICXAIBAAKBgQCXGAO6Lh9QhTHDMa1T") ===
    "UV51D7fGZIR8fW6KpEGCFRQ+ae2AjXQj"
  ) {
    console.log("You are already logged in");
  }

  const [login, setLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const flipLogin = (e) => {
    if (
      !isLoading &&
      ((login && e.target.text === "Signup") ||
        (!login && e.target.text === "Login"))
    )
      setLogin(!login);
  };

  return (
    <>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col">
          <div className="avatar">
            <div className="w-24 rounded">
              <img src={require("../../assets/dracula.png")} alt="Dracula logo" />
            </div>
          </div>
          <div className="welcome">
            <h1 className="text-3xl">Welcome to Greddiit!</h1>
          </div>
          <div className="tabs tabs-boxed">
            <a
              className={"tab " + (login ? "tab-active" : "")}
              onClick={flipLogin}
            >
              Login
            </a>
            <a
              className={"tab " + (!login ? "tab-active" : "")}
              onClick={flipLogin}
            >
              Signup
            </a>
          </div>
          {login ? (
            <Login isLoading={isLoading} setIsLoading={setIsLoading} />
          ) : (
            <Signup isLoading={isLoading} setIsLoading={setIsLoading} />
          )}
        </div>
      </div>
    </>
  );
};

export default Authorize;
