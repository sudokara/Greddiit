import React, { useEffect } from "react";
import Navbar from "../Navbar";
import { useState } from "react";
import Modal from "./Modal";
import Input from "./Input";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { axiosPrivate } from "../../api/axios";
import Loading from "../Loading";
import NotFound from "../NotFound";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  // User details
  const [email, setEmail] = useState("loading@loading.com");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("loading");
  const [lastName, setLastName] = useState("...");
  const [username, setUsername] = useState(
    jwt_decode(localStorage.getItem("greddiit-access-token")).username
  );
  const [contactNo, setContactNo] = useState("23646");
  const [age, setAge] = useState(19);

  // following/followers info
  const [followersArr, setFollowersArr] = useState([]);
  const [followingArr, setFollowingArr] = useState([]);

  // page stuff
  const [formModified, setFormModified] = useState(false);
  const [alert, setAlert] = useState("");

  useEffect(() => {
    const handlePopState = () => {
      console.log("Back button was pressed");
      if (formModified) {
        const confirmation = window.confirm(
          "Are you sure you want to go back?"
        );
        if (confirmation) {
          navigate(-1);
        }
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate, formModified]);

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
    onSuccess: () => {
      queryClient.invalidateQueries(["profile", username]);
    },
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
    onSuccess: () => {
      queryClient.invalidateQueries(["profile", username]);
    },
  });

  const handleEdit = async () => {
    setAlert("loading");
    axiosPrivate
      .patch("/api/user/edit", {
        firstname: firstName,
        lastname: lastName,
        contactnum: contactNo,
        password: password,
      })
      .then((response) => {
        setAlert("success");
        setTimeout(() => {
          setAlert("");
        }, 3000);
      })
      .catch((err) => {
        console.error(err);
        setAlert("failed");
        setTimeout(() => {
          setAlert("");
        }, 3000);
      });
  };

  const editMutation = useMutation({
    mutationFn: handleEdit,
    // onSuccess: () => {
      // queryClient.invalidateQueries(["profile", username]);
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

      {/* <div className="my-6 flex justify-center">
        <div className="text-center card w-96 bg-primary text-primary-content">
          <div className="card-body">
            <h1 className="text-3xl text-center">My Profile</h1>
          </div>
        </div>
      </div> */}

      <div className="flex my-5 flex-column w-full h-full justify-around flex-wrap content-center align-middle ">
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
              setFormModified={setFormModified}
              type="text"
              label="First Name"
              value={firstName}
              setValue={setFirstName}
            />

            <Input
              setFormModified={setFormModified}
              type="text"
              label="Username"
              value={username}
              setValue={setUsername}
              isDisabled={true}
            />

            <Input
              setFormModified={setFormModified}
              type="number"
              label="Age"
              value={age}
              setValue={setAge}
              isDisabled={true}
            />

            <Input
              setFormModified={setFormModified}
              type="password"
              label="New Password"
              value={password}
              setValue={setPassword}
            />
          </div>

          <div className="bg-base-50 shadow-xl w-1/2">
            {/* 2 */}
            <Input
              setFormModified={setFormModified}
              type="text"
              label="Last Name"
              value={lastName}
              setValue={setLastName}
            />

            <Input
              setFormModified={setFormModified}
              type="text"
              label="Email"
              value={email}
              setValue={setEmail}
              isDisabled={true}
            />

            <Input
              setFormModified={setFormModified}
              type="tel"
              label="Contact"
              value={contactNo}
              setValue={setContactNo}
            />

            <div className="">
              <button
                className={`my-6 mx-10 btn w-[44] btn-secondary ${alert === "loading" || editMutation.isLoading ? "loading" : ""} `}
                onClick={editMutation.mutate}
                disabled={
                  !password || editMutation.isLoading || alert === "loading"
                }
              >
                Save Changes
              </button>
              {alert === "success" ? (
                <div className="alert alert-success shadow-lg">
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
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Profile updated</span>
                  </div>
                </div>
              ) : alert === "failure" ? (
                <div className="alert alert-error shadow-lg">
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
                    <span>Error! Could not update profile.</span>
                  </div>
                </div>
              ) : (
                ""
              )}
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
