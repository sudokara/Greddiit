import React from "react";
import { useState } from "react";
import { Navigate, redirect, useNavigate } from "react-router-dom";

const Login = ({ isLoading, setIsLoading }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);

  const navigate = useNavigate();

  const handleLogin = (e) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    if (email === "admin" && password === "admin") {
      navigate("/me", { replace: true });
    }
    else {
        setShowError(true);
    }
  };

  return (
    <>
      <div className="card flex-shrink-0 w-full max-w-md shadow-2xl bg-base-100">
        <div className="card-body">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder="example@example.com"
              className="input input-bordered active:border-indigo-500/100 hover:border-indigo-500/100 focus:border-indigo-500/100"
              value={email}
              disabled={isLoading}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="notqwerty123"
              className="input input-bordered active:border-indigo-500/100 hover:border-indigo-500/100 focus:border-indigo-500/100"
              value={password}
              disabled={isLoading}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label
              htmlFor="forgot-password-modal"
              className="label cursor-pointer"
            >
              Forgot Password?
            </label>
            <input
              type="checkbox"
              id="forgot-password-modal"
              className="modal-toggle"
            />
            <label
              htmlFor="forgot-password-modal"
              className="modal cursor-pointer"
            >
              <label className="modal-box relative" htmlFor="">
                <h3 className="text-lg font-bold">Quite Sad!</h3>
                <p className="py-4">
                  You can think harder, because that's the only way you can get
                  your password back; even I don't know what it is.
                </p>
              </label>
            </label>
          </div>
          <div className={`form-control mt-6`}>
            <button
              disabled={!email || !password || isLoading}
              className={`btn btn-primary`}
              onClick={handleLogin}
            >
              <svg
                className={
                  "h-4 w-4 invisible animate-spin " +
                  (isLoading ? "collapse" : "invisible")
                }
                viewBox="3 3 18 18"
              >
                <path
                  className="fill-blue-800"
                  d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z"
                ></path>
                <path
                  className="fill-blue-100"
                  d="M16.9497 7.05015C14.2161 4.31648 9.78392 4.31648 7.05025 7.05015C6.65973 7.44067 6.02656 7.44067 5.63604 7.05015C5.24551 6.65962 5.24551 6.02646 5.63604 5.63593C9.15076 2.12121 14.8492 2.12121 18.364 5.63593C18.7545 6.02646 18.7545 6.65962 18.364 7.05015C17.9734 7.44067 17.3403 7.44067 16.9497 7.05015Z"
                ></path>
              </svg>
              <span>Login</span>
            </button>
            {showError ? (
              <div className="alert alert-error shadow-lg mt-5">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-current flex-shrink-0 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Incorrect username or password.</span>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
