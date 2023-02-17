import React from "react";
import { BiUpvote, BiDownvote, BiUserCheck, BiUserPlus } from "react-icons/bi";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { ImWarning } from "react-icons/im";
import { TfiCommentAlt } from "react-icons/tfi";

const PostCard = ({
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
}) => {
  return (
    <>
      <div className="w-2/3">
        <div className="card card-side bg-base-100 shadow-xl">
          <div className="flex flex-col flex-wrap justify-around">
            <div className="flex justify-center my-2">
              {/* //! upvote and downvote functionality */}
              <button>
                <BiUpvote style={upvoteActive ? { color: "orange" } : {}} />
              </button>
            </div>
            <div className="flex justify-center">{numUpvotes}</div>
            <div className="flex justify-center my-2">
              <button>
                <BiDownvote
                  style={downvoteActive ? { color: "blueviolet" } : {}}
                />
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
                {/* //! comments  */}
                <button className="btn btn-outline mx-1 gap-2">
                  <TfiCommentAlt style={{ display: "inline" }} />{" "}
                  {comments.length}
                </button>
                {/* //!save/unsave  */}
                <button className="btn btn-outline mx-1 gap-2">
                  {saveActive ? <BsBookmarkFill /> : <BsBookmark />}{" "}
                  {saveActive ? "saved" : "save"}
                </button>
                {/* //!follow  */}
                <button className="btn btn-outline mx-1 gap-2">
                  {followActive ? <BiUserCheck /> : <BiUserPlus />}{" "}
                  {followActive ? "following" : "follow"}
                </button>
                {/* //!report active? report functionality */}
                <button className="btn btn-outline mx-1 gap-2">
                  <ImWarning />
                  Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostCard;
