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
  const [loading, setLoading] = useState(false);
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

  const getPosts = async () => {
    try {
      const response = await axiosPrivate.get(`/api/post/${name}`);
      if (debug) console.log(response.data);

      const followingResponse = await axiosPrivate.get("/api/user/following");
      if (debug) console.log("following" + followingResponse.data);

      const savedResponse = await axiosPrivate.get("/api/user/saved");
      if (debug) console.log("saved" + savedResponse.data);

      return {
        saved: savedResponse.data.map((item) => item.id),
        following: followingResponse.data,
        posts: response.data,
      };
    } catch (err) {
      if (debug) console.error(err);
      return null;
    }
  };

  const postsQuery = useQuery({
    queryKey: ["posts", name],
    queryFn: getPosts,
  });

  if (subQuery.isLoading || !subQuery.data) return <Loading />;
  if (postsQuery.isLoading || !postsQuery.data) return <Loading />;
  if (subQuery.isError) return "Error fetching data";
  if (postsQuery.isError) return "Error fetching data";

  const isFollower = subQuery.data.followers.some(
    (item) => item.username === username
  );

  return (
    <>
      <Navbar />
      <div className="flex flex-wrap flex-col">
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
        <div className="flex flex-col flex-wrap">
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

          <div className="flex flex-col w-full justify-around border-2 border-red-500">
            {postsQuery.data.posts.length
              ? postsQuery.data.posts.map((item) => (
                  <div
                    key={item._id}
                    className="flex flex-wrap justify-center border-2 border-sky-500"
                  >
                    <div className="lg:w-2/3 md:w-full">
                      <PostCard
                        id={item.id}
                        title={item.title}
                        text={item.text}
                        numUpvotes={item.upvotes.length - item.downvotes.length}
                        comments={item.comments}
                        upvoteActive={item.upvotes.includes(username)}
                        downvoteActive={item.downvotes.includes(username)}
                        // ?check if saved
                        saveActive={postsQuery.data.saved.includes(item.id)}
                        // !check if user is followed
                        followActive={
                          item.posted_by !== username &&
                          postsQuery.data.following.includes(item.posted_by)
                        }
                        followDisable={item.posted_by === username}
                        //! add report disable condition
                        reportDisable={item.posted_by === username}
                        postedBy={item.posted_by}
                        loading={loading}
                        postedIn={item.posted_in}
                        setLoading={setLoading}
                        allDisable={!isFollower}
                      />
                    </div>
                  </div>
                ))
              : "No posts yet"}
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
