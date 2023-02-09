import React, { useContext } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthProvider";

const Login = ({ isLoading, setIsLoading }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);

  const navigate = useNavigate();

  // const handleLogin = (e) => {
  //   setIsLoading(true);
  //   setTimeout(() => {
  //     setIsLoading(false);
  //   }, 1000);

  //   if (email === "admin" && password === "admin") {
  //     localStorage.setItem(
  //       "MIICXAIBAAKBgQCXGAO6Lh9QhTHDMa1T",
  //       "UV51D7fGZIR8fW6KpEGCFRQ+ae2AjXQj"
  //     );
  //     navigate("/me", { replace: true });
  //   } else {
  //     setShowError(true);
  //   }
  // };

  const handleLogin = (e) => {
    const { accessToken } = useContext(AuthContext)(async () => {
      const res = axios.post("http://localhost:5000/auth", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        username: username,
        password: password,
      });
      console.log(res);
    })();
  };

  return (
    <>
      <div className="card flex-shrink-0 w-full max-w-md shadow-2xl bg-base-100">
        <div className="card-body">
          <div className="form-control">
            <label className="label">
              {/* <span className="label-text">Email</span> */}
              <span className="label-text">Username</span>
            </label>
            <input
              // type="email"
              type="text"
              // placeholder="example@example.com"
              placeholder="admin"
              className="input input-bordered active:border-indigo-500/100 hover:border-indigo-500/100 focus:border-indigo-500/100"
              value={username}
              disabled={isLoading}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                // placeholder="notqwerty123"
                placeholder="admin"
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
                    You can think harder, because that's the only way you can
                    get your password back; even I don't know what it is.
                  </p>
                </label>
              </label>
            </div>
            <div className={`form-control mt-6`}>
              <button
                disabled={!username || !password}
                className={`btn btn-primary ${isLoading ? "loading" : ""}`}
                onClick={handleLogin}
              >
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
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
