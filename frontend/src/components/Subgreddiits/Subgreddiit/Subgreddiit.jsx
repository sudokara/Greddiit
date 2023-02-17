import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { axiosPrivate } from "../../../api/axios";
import { FiUsers } from "react-icons/fi";
import { BsCardText } from "react-icons/bs";
import jwt_decode from "jwt-decode";
import Loading from "../../Loading";
import Navbar from "../../Navbar";
import CreatePost from "./Posts/CreatePost";
import PostCard from "./Posts/PostCard";

const debug = false;

const Subgreddiit = () => {
  const { name } = useParams();
  const [showModal, setShowModal] = useState(false);
  const username = jwt_decode(
    localStorage.getItem("greddiit-access-token")
  ).username;

  const getSubInfo = async () => {
    try {
      const response = await axiosPrivate.get(`/api/gr/info/${name}`);
      if (debug) console.log(response.data);
      return response.data;
    } catch (err) {
      if (debug) console.error(err);
      return null;
    }
  };

  const subQuery = useQuery({
    queryKey: ["subinfo", name],
    queryFn: getSubInfo,
  });

  if (subQuery.isLoading || !subQuery.data) return <Loading />;
  if (subQuery.isError) return "Error fetching data";

  const isFollower = subQuery.data.followers.some(
    (item) => item.username === username
  );

  return (
    <>
      <Navbar />
      {/* <div className="flex flex-col flex-wrap justify-center">
        <div className="flex flex-wrap">
          <div className="flex w-full justify-center">
            <img
              src={
                subQuery.data?.image ||
                require("../../../assets/defaultbanner.webp")
              }
              height={100}
              alt={`${name} banner`}
            />
          </div>
        </div>
        <div className="flex flex-wrap justify-start">
          <div className="w-1/5">
            <div className="card card-compact w-full bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Sub Info</h2>
                <div className="te">
                  <div>
                    <FiUsers style={{ display: "inline" }} /> :
                    {subQuery.data.num_people}
                  </div>
                  <div>
                    <BsCardText style={{ display: "inline" }} /> :{" "}
                    {subQuery.data.num_posts}
                  </div>
                </div>
                <div className="card-actions justify-center">
                  <button className="btn btn-primary">Create Post</button>
                </div>
              </div>
            </div>
          </div>
          <div className="break-all">
            {JSON.stringify(subQuery.data)}
            {JSON.stringify(subQuery.data)}
            {JSON.stringify(subQuery.data)}
            {JSON.stringify(subQuery.data)}
            {JSON.stringify(subQuery.data)}
            {JSON.stringify(subQuery.data)}
            {JSON.stringify(subQuery.data)}
          </div>
        </div>
      </div> */}
      <div className="flex flex-wrap flex-col justify-center">
        <div className="flex flex-center">
          <img
            src={
              subQuery.data?.image ||
              require("../../../assets/defaultbanner.webp")
            }
            alt={`${name} banner`}
            style={{
              height: "200px",
              width: "100%",
              objectFit: "cover",
            }}
          />
        </div>

        {/* card and posts  */}
        <div className="flex flex-col flex-wrap justify-center">
          {/* card  */}
          <div className="flex justify-center">
            <div className="card w-96 bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">r/{subQuery.data?.name}</h2>
                <div>
                  <p>{subQuery.data.description}</p>
                  <div>
                    <FiUsers style={{ display: "inline" }} /> :
                    {subQuery.data.num_people}
                  </div>
                  <div>
                    <BsCardText style={{ display: "inline" }} /> :{" "}
                    {subQuery.data.num_posts}
                  </div>
                </div>
                <div className="card-actions justify-center">
                  <button
                    disabled={!isFollower}
                    className="btn btn-primary"
                    onClick={() => {
                      if (isFollower) {
                        setShowModal(true);
                      }
                    }}
                  >
                    Create Post
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="divider"></div>

          <div className="flex justify-around">
            <div className="w-1/2 mx-5">
              <PostCard
                title="Post title"
                text="Post text blah blah lorem ipsum dolor sit amet"
                upvoteActive={false}
                downvoteActive={true}
                numUpvotes="3.1k"
                postedBy="somebot"
                comments={[]}
              />
            </div>
            <div className="w-1/2">
              <PostCard
                title="Post title"
                text="123456789012345678901234567890123456789012345678901234567890"
                upvoteActive={false}
                downvoteActive={true}
                numUpvotes="3.1k"
                postedBy="someotherbot"
                postedIn={name}
                comments={[]}
              />
            </div>
          </div>
        </div>
      </div>

      {showModal ? (
        <CreatePost setShowModal={setShowModal} subName={name} />
      ) : (
        ""
      )}
    </>
  );
};

export default Subgreddiit;
