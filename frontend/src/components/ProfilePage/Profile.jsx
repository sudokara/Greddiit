import React from "react";
import Navbar from "../Navbar";
import { useState } from "react";
import Modal from "./Modal";
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
              <div className="badge ml-2 badge-secondary">
                {followersArr.length}
              </div>
            </label>
          </div>
          <div className="bg-base-50 w-1/2 text-center">
            {/* 0The button to open modal */}
            <label htmlFor="following-modal" className="btn w-[44]">
              Following
              <div className="badge ml-2 badge-secondary">
                {followingArr.length}
              </div>
            </label>
          </div>

          <div className="bg-base-50 shadow-xl w-1/2 text-center">
            {/* 1 */}
            <Input
              type="text"
              label="First Name"
              value={firstName}
              setValue={setFirstName}
            />

            <Input
              type="text"
              label="Username"
              value={username}
              setValue={setUsername}
              isDisabled={true}
            />

            <Input
              type="number"
              label="Age"
              value={age}
              setValue={setAge}
              isDisabled={true}
            />

            <Input
              type="text"
              label="Password"
              value={password}
              setValue={setPassword}
            />
          </div>

          <div className="bg-base-50 shadow-xl w-1/2">
            {/* 2 */}
            <Input
              type="text"
              label="Last Name"
              value={lastName}
              setValue={setLastName}
            />

            <Input
              type="text"
              label="Email"
              value={email}
              setValue={setEmail}
              isDisabled={true}
            />

            <Input
              type="tel"
              label="Contact"
              value={contactNo}
              setValue={setContactNo}
            />

            <div className="">
              <button className="my-6 mx-10 btn w-[44] btn-secondary">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        id="followers-modal"
        heading="Your followers"
        array={followersArr}
      />

      <Modal
        id="following-modal"
        heading="You're Following"
        array={followingArr}
      />
    </>
  );
};

export default Profile;
