import React from "react";
import Navbar from "./Navbar";
import { useState } from "react";
import Input from "./Input";

const Profile = () => {
  const [email, setEmail] = useState("admin@admin.com");
  const [password, setPassword] = useState("admin");
  const [firstName, setFirstName] = useState("admin");
  const [lastName, setLastName] = useState("admin");
  const [username, setUsername] = useState("admin");
  const [contactNo, setContactNo] = useState("23646");
  const [age, setAge] = useState(19);
  const followersArr = ["Linus_Torvalds", "Alan_Turing", "Dennis_Ritchie"];
  const followingArr = [
    "Linus_Torvalds",
    "Alan_Turing",
    "Dennis_Ritchie",
    "Larry_Page",
    "Mark_Zuckerberg",
  ];

  return (
    <>
      <Navbar />

      <div className="my-6 flex justify-center">
        <div className="text-center card w-96 bg-primary text-primary-content">
          <div className="card-body">
            <h1 className="text-3xl text-center">My Profile</h1>
          </div>
        </div>
      </div>

      <div className="flex flex-column w-full h-full justify-around flex-wrap content-center align-middle ">
        <div className="flex w-full h-full justify-around flex-wrap align-middle mx-3">
          <div className="flex flex-row justify-center bg-base-50  w-1/2 text-center">
            {/* -1 */}
            {/* The button to open modal */}
            <label htmlFor="followers-modal" className="btn w-[44]">
              Followers
              <div className="badge badge-secondary">{followersArr.length}</div>
            </label>
          </div>
          <div className="bg-base-50 w-1/2 text-center">
            {/* 0The button to open modal */}
            <label htmlFor="following-modal" className="btn w-[44]">
              Following
              <div className="badge badge-secondary">{followingArr.length}</div>
            </label>
          </div>

          <div className="bg-base-50 shadow-xl w-1/2 text-center">
            {/* 1 */}
            {/* <div className="card-body form-control ml-2">
              <label className="label">
                <span className="label-text ">First Name</span>
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
                className="input input-bordered input-secondary w-full max-w-xs"
              />
            </div> */}
            <Input type="text" label="First Name" value={firstName} setValue={setFirstName} />
            {/* <div className="card-body form-control ml-2">
              <label className="label">
                <span className="label-text ">Username</span>
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
                className="input input-bordered input-secondary w-full max-w-xs"
              />
            </div> */}
            <Input type="text" label="Username" value={username} setValue={setUsername} />

            {/* <div className="card-body form-control ml-2">
              <label className="label">
                <span className="label-text ">Age</span>
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => {
                  setAge(e.target.value);
                }}
                className="input input-bordered input-secondary w-full max-w-xs"
              />
            </div> */}
            <Input type="number" label="Age" value={age} setValue={setAge} isDisabled={true} />

            {/* <div className="card-body form-control ml-2">
              <label className="label">
                <span className="label-text ">Password</span>
              </label>
              <input
                type="text"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                className="input input-bordered input-secondary w-full max-w-xs"
              />
            </div> */}
            <Input type="text" label="Password" value={password} setValue={setPassword} />

          </div>

          <div className="bg-base-50 shadow-xl w-1/2">
            {/* 2 */}
            {/* <div className="card-body form-control ml-2">
              <label className="label">
                <span className="label-text ">Last Name</span>
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
                className="input input-bordered input-secondary w-full max-w-xs"
              />
            </div> */}
            <Input type="text" label="Last Name" value={lastName} setValue={setLastName} />
            
            {/* <div className="card-body form-control ml-2">
              <label className="label">
                <span className="label-text ">Email</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                className="input input-bordered input-secondary w-full max-w-xs"
              />
            </div> */}
            <Input type="text" label="Email" value={email} setValue={setEmail} isDisabled={true} />

            {/* <div className="card-body form-control ml-2">
              <label className="label">
                <span className="label-text ">Contact</span>
              </label>
              <input
                type="number"
                value={contactNo}
                onChange={(e) => {
                  setContactNo(e.target.value);
                }}
                className="input input-bordered input-secondary w-full max-w-xs"
              />
            </div> */}
            <Input type="number" label="Contact" value={contactNo} setValue={setContactNo} />

            <div className="">
              <button className="my-6 mx-10 btn w-[44] btn-secondary">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Put this part before </body> tag */}
      <input type="checkbox" id="followers-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box relative">
          <label
            htmlFor="followers-modal"
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <h3 className="text-lg font-bold">Your Followers</h3>
          <ul className="list-none">
            {followersArr.map((item) => (
              <li className="text-center m-5" key={followersArr.indexOf(item)}>
                {item}
                <button className="btn btn-circle">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <input type="checkbox" id="following-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box relative">
          <label
            htmlFor="following-modal"
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <h3 className="text-lg font-bold">You're Following</h3>
          <ul className="list-none">
            {followingArr.map((item) => (
              <li className="text-center" key={item}>
                {item}
                <button className="btn btn-circle">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Profile;
