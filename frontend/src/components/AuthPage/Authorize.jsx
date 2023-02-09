import React from "react";
import { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";

const Authorize = () => {
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
            <div
              className={"tab " + (login ? "tab-active" : "")}
              onClick={flipLogin}
            >
              Login
            </div>
            <div
              className={"tab " + (!login ? "tab-active" : "")}
              onClick={flipLogin}
            >
              Signup
            </div>
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
