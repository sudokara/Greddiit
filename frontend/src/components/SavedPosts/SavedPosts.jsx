import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { axiosPrivate } from "../../api/axios";
import jwt_decode from "jwt-decode";
import Navbar from "../Navbar";
import Loading from "../Loading";
import PostCard from "../Subgreddiits/Subgreddiit/Posts/PostCard";

const debug = true;

const SavedPosts = () => {
  const [isLoading, setisLoading] = useState(false);
  const username = jwt_decode(
    localStorage.getItem("greddiit-access-token")
  ).username;

  const getSavedPosts = async () => {
    try {
      const response = await axiosPrivate.get("/api/user/saved");
      if (debug) console.log(response.data);

      const followingResponse = await axiosPrivate.get("/api/user/following");
      if (debug) console.log(followingResponse.data);

      return { saved: response.data, following: followingResponse.data };
    } catch (err) {
      if (debug) console.error(err);
      return null;
    }
  };

  const savedPostsQuery = useQuery({
    queryKey: ["saved", username],
    queryFn: getSavedPosts,
  });

  if (savedPostsQuery.isLoading || !savedPostsQuery.data) return <Loading />;
  if (savedPostsQuery.isError) return "Error fetching data";

  return (
    <>
      <Navbar />
      {/* {savedPostsQuery.data.map((item) => JSON.stringify(item))} */}
      <div className="flex flex-wrap justify-around">
        {savedPostsQuery.data.saved.length
          ? savedPostsQuery.data.saved.map((item) => (
              <div key={item._id} className="lg:w-1/2 md:w-full">
                <PostCard
                  id={item.id}
                  title={item.title}
                  text={item.text}
                  numUpvotes={item.upvotes.length - item.downvotes.length}
                  comments={item.comments}
                  upvoteActive={item.upvotes.includes(username)}
                  downvoteActive={item.downvotes.includes(username)}
                  saveActive={true}
                  followActive={
                    item.posted_by !== username &&
                    savedPostsQuery.data.following.includes(item.posted_by)
                  }
                  followDisable={item.posted_by === username}
                  //! add report disable condition
                  reportDisable={item.posted_by === username}
                  postedBy={item.posted_by}
                  postedIn={item.posted_in}
                  loading={isLoading}
                  setLoading={setisLoading}
                />
              </div>
            ))
          : "No saved posts"}
      </div>
    </>
  );
};

export default SavedPosts;
