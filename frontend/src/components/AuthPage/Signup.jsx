import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";

const Signup = ({ isLoading, setIsLoading }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [age, setAge] = useState(18);
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const handleSignup = (e) => {
    setShowError(false);
    setIsLoading(true);
    axios
      .post("/api/auth/register", {
        firstname: firstName,
        lastname: lastName,
        email,
        contactnum: contactNo,
        age,
        username,
        password,
      })
      .then((response) => {
        // console.log(response?.data?.accessJWT);
        localStorage.setItem("greddiit-access-token", response.data.accessJWT);
        navigate("/me", { replace: true });
      })
      .catch((err) => {
        console.error(err);
        setShowError(true);
        setErrorMsg(err.response.data.message);
      })
      .then(() => setIsLoading(false));
  };

  return (
    <>
      <div className="card flex w-full max-w-md shadow-2xl bg-base-100">
        <div className="card-body">
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">First Name</span>
              </label>
              <input
                type="text"
                placeholder="Count"
                className="input input-bordered active:border-indigo-500/100 hover:border-indigo-500/100 focus:border-indigo-500/100"
                value={firstName}
                disabled={isLoading}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Last Name</span>
              </label>
              <input
                type="text"
                placeholder="Dracula"
                className="input input-bordered active:border-indigo-500/100 hover:border-indigo-500/100 focus:border-indigo-500/100"
                value={lastName}
                disabled={isLoading}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Username</span>
              </label>
              <input
                type="text"
                placeholder="dracula7"
                className="input input-bordered active:border-indigo-500/100 hover:border-indigo-500/100 focus:border-indigo-500/100"
                value={username}
                disabled={isLoading}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
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
                <span className="label-text">Age</span>
              </label>
              <input
                type="number"
                min={13}
                max={120}
                className="input input-bordered active:border-indigo-500/100 hover:border-indigo-500/100 focus:border-indigo-500/100"
                value={age}
                disabled={isLoading}
                onChange={(e) => setAge(e.target.value)}
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Contact</span>
              </label>
              <input
                type="tel"
                pattern="[0-9]{10}"
                placeholder="1234567890"
                className="input input-bordered active:border-indigo-500/100 hover:border-indigo-500/100 focus:border-indigo-500/100"
                value={contactNo}
                disabled={isLoading}
                onChange={(e) => setContactNo(e.target.value)}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="iltransylvania"
                className="input input-bordered active:border-indigo-500/100 hover:border-indigo-500/100 focus:border-indigo-500/100"
                value={password}
                disabled={isLoading}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className={`form-control mt-6`}>
              <button
                disabled={
                  !email ||
                  !password ||
                  !firstName ||
                  !lastName ||
                  !contactNo ||
                  !username ||
                  isLoading
                }
                className={`btn btn-primary ${isLoading ? "loading" : ""}`}
                onClick={handleSignup}
              >
                <span>Signup</span>
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
                    <span>{errorMsg}</span>
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

export default Signup;
