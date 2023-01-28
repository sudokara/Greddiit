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
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
