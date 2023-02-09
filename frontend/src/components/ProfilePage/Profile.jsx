import React from "react";
import Navbar from "../Navbar";
import { useState } from "react";
import Modal from "./Modal";
import Input from "./Input";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { axiosPrivate } from "../../api/axios";
import Loading from "../Loading";
import NotFound from "../NotFound";
import jwt_decode from "jwt-decode";

const Profile = () => {
  const [email, setEmail] = useState("admin@admin.com");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("admin");
  const [lastName, setLastName] = useState("admin");
  const [username, setUsername] = useState(
    jwt_decode(localStorage.getItem("greddiit-access-token")).username
  );
  const [contactNo, setContactNo] = useState("23646");
  const [age, setAge] = useState(19);
  const [followersArr, setFollowersArr] = useState([]);
  const [followingArr, setFollowingArr] = useState([]);

  const getProfile = async () => {
    try {
      const response = await axiosPrivate.get(`/api/user/${username}`);
      setFirstName(response.data.firstname);
      setLastName(response.data.lastname);
      setEmail(response.data.email);
      setAge(response.data.age);
      setContactNo(response.data.contactnum);
      setFollowersArr(response.data.followers);
      setFollowingArr(response.data.following);
      return response.data;
    } catch (err) {
      console.log(err);
      return null;
    }
  };

  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: ["profile", username],
    queryFn: getProfile,
  });

  const handleRemoveFollower = async (unfollower) => {
    console.log("remove follower");
    axiosPrivate
      .post("/api/user/removefollower", { follower: unfollower })
      .then((response) => {
        console.log(response);
        const newFollowers = followersArr.filter((user) => user !== unfollower);
        setFollowersArr(newFollowers);
      })
      .catch((err) => console.error(err));
  };

  const removeFollowerMutation = useMutation({
    mutationFn: (unfollower) => handleRemoveFollower(unfollower),
    // onSuccess: () => {
      // queryClient.invalidateQueries(["profile", username]);
    // },
  });

  const handleUnfollow = async (unfollower) => {
    console.log("unfollow");
    axiosPrivate
      .post("/api/user/unfollow", {
        unfollow: unfollower,
      })
      .then((response) => {
        console.log(response);
        const newFollowing = followingArr.filter((user) => user !== unfollower);
        setFollowingArr(newFollowing);
      })
      .catch((err) => console.error(err));
  };

  const unfollowMutation = useMutation({
    mutationFn: (unfollower) => handleUnfollow(unfollower),
    // onSuccess: () => {
    //   queryClient.invalidateQueries(["profile", username]);
    // },
  });

  if (profileQuery.isLoading) {
    return <Loading />;
  }

  if (profileQuery.isError) {
    return <NotFound />;
  }

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
        heading="Your Followers"
        array={followersArr}
        handleClick={removeFollowerMutation.mutate}
      />

      <Modal
        id="following-modal"
        heading="You're Following"
        array={followingArr}
        handleClick={unfollowMutation.mutate}
      />
    </>
  );
};

export default Profile;
