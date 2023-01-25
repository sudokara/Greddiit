import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = ({ isLoading, setIsLoading }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [age, setAge] = useState(18);

  const navigate = useNavigate();

  // const disableSignupButton = () => {
  //   if (
  //     !email ||
  //     !password ||
  //     !firstName ||
  //     !lastName ||
  //     !username ||
  //     !contactNo ||
  //     isLoading
  //   ) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // };

  const handleSignup = (e) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/me");
    }, 1000);
  };

  return (
    <>
      <div className="card flex-shrink-0 w-full max-w-md shadow-2xl bg-base-100">
        <div className="card-body">
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
              className={`btn btn-primary`}
              onClick={handleSignup}
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
              <span>Signup</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
