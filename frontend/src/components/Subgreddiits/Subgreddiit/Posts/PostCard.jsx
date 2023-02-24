import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { BiUpvote, BiDownvote, BiUserCheck, BiUserPlus } from "react-icons/bi";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { ImWarning } from "react-icons/im";
import { TfiCommentAlt } from "react-icons/tfi";
import { axiosPrivate } from "../../../../api/axios";
import jwt_decode from "jwt-decode";
import CommentsCard from "./CommentsCard";

const debug = true;

const PostCard = ({
  id,
  subgr,
  title,
  text,
  numUpvotes,
  comments,
  upvoteActive,
  downvoteActive,
  saveActive,
  followActive,
  postedBy,
  postedIn,
  followDisable,
  reportDisable,
  allDisable,
  loading,
  setLoading,
}) => {
  const [saved, setSaved] = useState(saveActive);
  const [followed, setFollowed] = useState(followActive);
  const [upvoted, setUpvoted] = useState(upvoteActive);
  const [downvoted, setDownvoted] = useState(downvoteActive);
  const [upvoteCount, setUpvoteCount] = useState(numUpvotes);
  const [showComments, setShowComments] = useState(false);

  const username = jwt_decode(
    localStorage.getItem("greddiit-access-token")
  ).username;
  const queryClient = useQueryClient();

  const handleSaveChange = async (newStatus) => {
    if (newStatus !== "save" && newStatus !== "unsave") return;
    setLoading(true);

    try {
      const response = await axiosPrivate.get(
        `/api/post/${newStatus}/${postedIn}/${id}`
      );
      setSaved(newStatus === "save" ? true : false);

      if (debug) console.log(response.data);
    } catch (err) {
      if (debug) console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const saveChangeMutation = useMutation({
    mutationFn: (newStatus) => {
      handleSaveChange(newStatus);
    },
    onSuccess: () => {
      setTimeout(() => {
        queryClient.invalidateQueries(["saved", username]);
        queryClient.removeQueries(["subinfo"]);
        queryClient.removeQueries(["posts"]);
      }, 400);
    },
  });

  const handleFollowChange = async (newStatus) => {
    if (newStatus !== "follow" && newStatus !== "unfollow") return;
    setLoading(true);

    try {
      if (newStatus === "follow") {
        console.log("follow");
        const response = axiosPrivate.post("/api/user/addfollowing", {
          following: postedBy,
        });
        setFollowed(true);
        if (debug) console.log(response.data);
      } else {
        const response = axiosPrivate.post("/api/user/unfollow", {
          unfollow: postedBy,
        });
        setFollowed(false);
        if (debug) console.log(response.data);
      }
    } catch (err) {
      if (debug) console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const followChangeMutation = useMutation({
    mutationFn: (newStatus) => {
      handleFollowChange(newStatus);
    },
    onSuccess: () => {
      setTimeout(() => {
        queryClient.invalidateQueries(["profile", username]);
        queryClient.invalidateQueries(["posts", postedIn]);
      }, 1000);
    },
  });

  const handleUpvote = async () => {
    if (downvoted) return;
    if (upvoted) {
      try {
        setLoading(true);
        const response = await axiosPrivate.get(
          `/api/post/unupvote/${postedIn}/${id}`
        );
        if (debug) console.log(response.data);
        setUpvoted(false);
        setUpvoteCount((upvoteCount) => upvoteCount - 1);
      } catch (err) {
        if (err) console.log(err);
      } finally {
        setLoading(false);
      }
    } else {
      try {
        setLoading(true);
        const response = await axiosPrivate.get(
          `/api/post/upvote/${postedIn}/${id}`
        );
        if (debug) console.log(response.data);
        setUpvoted(true);
        setUpvoteCount((upvoteCount) => upvoteCount + 1);
      } catch (err) {
        if (err) console.log(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const upvoteMutation = useMutation({
    mutationFn: handleUpvote,
    onSuccess: () => {
      setTimeout(() => {
        queryClient.invalidateQueries(["posts", postedIn]);
        queryClient.invalidateQueries(["saved"]);
      }, 1000);
    },
  });

  const handleDownvote = async () => {
    if (upvoted) return;
    if (downvoted) {
      try {
        setLoading(true);
        const response = await axiosPrivate.get(
          `/api/post/undownvote/${postedIn}/${id}`
        );
        if (debug) console.log(response.data);
        setDownvoted(false);
        setUpvoteCount((upvoteCount) => upvoteCount + 1);
      } catch (err) {
        if (debug) console.error(err);
      } finally {
        setLoading(false);
      }
    } else {
      try {
        setLoading(true);
        const response = await axiosPrivate.get(
          `/api/post/downvote/${postedIn}/${id}`
        );
        if (debug) console.log(response.data);
        setDownvoted(true);
        setUpvoteCount((upvoteCount) => upvoteCount - 1);
      } catch (err) {
        if (debug) console.log(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const downvoteMutation = useMutation({
    mutationFn: handleDownvote,
    onSuccess: () => {
      setTimeout(() => {
        queryClient.invalidateQueries(["posts", postedIn]);
        queryClient.invalidateQueries(["saved"]);
      }, 1000);
    },
  });

  const handleReport = async () => {
    const concern = window.prompt(
      "What is your concern with this post? ",
      "Circumventing banned keywords"
    );
    if (concern == null) return;

    try {
      const response = await axiosPrivate.post("/api/report", {
        concern: concern,
        subgreddiit: subgr,
        post_id: id,
      });
      if (debug) console.log(await response.data);
    } catch (err) {
      if (debug) console.error(err);
    }

    window.alert("Report made!");
  };

  return (
    <>
      <div className="w-full">
        <div className="card card-side bg-base-100 shadow-xl">
          <div className="flex flex-col flex-wrap justify-around">
            <div className="flex justify-center my-2">
              {/* //? upvote and downvote functionality */}
              <button
                disabled={allDisable}
                onClick={() => upvoteMutation.mutate()}
              >
                <BiUpvote style={upvoted ? { color: "orange" } : {}} />
              </button>
            </div>
            <div className="flex justify-center">{upvoteCount}</div>
            <div className="flex justify-center my-2">
              <button disabled={allDisable} onClick={downvoteMutation.mutate}>
                <BiDownvote style={downvoted ? { color: "blueviolet" } : {}} />
              </button>
            </div>
          </div>
          <div className="card-body">
            <p className="text-sm">
              {postedIn ? `In r/${postedIn} by ` : ""} u/{postedBy}
            </p>
            <h2 className="card-title text-primary">{title}</h2>
            <p>{text.length > 47 ? text.slice(0, 47) + "..." : text}</p>
            <div className="card-actions justify-end">
              <div className="flex justify-around flex-wrap">
                {/* //? comments  */}
                <button
                  disabled={allDisable}
                  className="btn btn-outline mx-1 gap-2"
                  onClick={() => setShowComments(true)}
                >
                  <TfiCommentAlt style={{ display: "inline" }} />{" "}
                  {comments.length}
                </button>

                {/* //? save  */}
                <button
                  disabled={allDisable}
                  className={`btn btn-outline mx-1 gap-2 ${
                    loading ? "loading" : ""
                  }`}
                  onClick={() => {
                    saved
                      ? saveChangeMutation.mutate("unsave")
                      : saveChangeMutation.mutate("save");
                  }}
                >
                  {saved ? <BsBookmarkFill /> : <BsBookmark />}{" "}
                  {saved ? "saved" : "save"}
                </button>

                {/* //? follow  */}
                <button
                  disabled={followDisable || allDisable}
                  className={`btn btn-outline mx-1 gap-2 ${
                    loading ? "loading" : ""
                  }`}
                  onClick={() => {
                    followed
                      ? followChangeMutation.mutate("unfollow")
                      : followChangeMutation.mutate("follow");
                  }}
                >
                  {followed ? <BiUserCheck /> : <BiUserPlus />}{" "}
                  {followed ? "following" : "follow"}
                </button>

                {/* //!report active? report functionality */}
                <button
                  disabled={reportDisable || allDisable}
                  className="btn btn-outline mx-1 gap-2"
                  onClick={handleReport}
                >
                  <ImWarning />
                  Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CommentsCard
        showModal={showComments}
        setShowModal={setShowComments}
        // comments={[
        //   {
        //     username: "rohan",
        //     comment_text: "LCD IIIT",
        //     _id: "63f470b903b1e3255ee86a2a",
        //   },
        //   {
        //     username: "vineeth",
        //     comment_text: "frog",
        //     _id: "63f470b903b1e3255ee86a2a",
        //   },
        // ]}
        comments={comments}
        subgr={subgr}
        id={id}
      />
    </>
  );
};

export default PostCard;
