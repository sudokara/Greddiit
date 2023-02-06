const mongoose = require("mongoose");
const Post = require("../models/PostModel");
const SubGreddiit = require("../models/SubGreddiitModel");
const User = require("../models/UserModel");
const StatusCodes = require("http-status-codes").StatusCodes;
const ReasonPhrases = require("http-status-codes").ReasonPhrases;

/// @POST /post/:subgr
/// Must be logged in and part of subgreddiit and not banned
/// Create a post in the subgreddiit
const createPost = async (req, res) => {
  const subgr = req.params.subgr;
  const postText = req.body.text;
  const postTitle = req.body.title;

  // check if both title and text provided
  // if not send bad request response
  if (!postText || !postTitle) {
    return res.status(StatusCodes.BAD_REQUEST).send({
      error: ReasonPhrases.BAD_REQUEST,
      message: "Please provide both title and text for the post",
    });
  }

  // check if logged in user is part of the subgreddiit and is not blocked
  // Else send forbidden response
  const foundSubgr = await SubGreddiit.findOne(
    { name: subgr },
    { followers: 1, banned_keywords: 1 }
  );
  if (
    !foundSubgr.followers.some(
      (item) => item.username === req.user && item.blocked === false
    )
  ) {
    return res.status(StatusCodes.FORBIDDEN).send({
      error: ReasonPhrases.FORBIDDEN,
      message: "You are not part of this subgreddiit or have been blocked",
    });
  }

  // censor banned keywords
  // the regex is /bannedword1|bannedword2|bannedword3/gi
  const filter = new RegExp(`${foundSubgr.banned_keywords.join("|")}`, "gi");
  const censoredText = postText.replace(filter, "****");
  const censoredTitle = postTitle.replace(filter, "****");
  const isCensored = postText !== censoredText || postTitle !== censoredTitle;

  // add the post to the subgreddiit
  const newPost = new Post({
    title: censoredTitle,
    text: censoredText,
    posted_by: req.user,
    posted_in: subgr,
  });
  newPost.save((err, doc) => {
    if (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        error: ReasonPhrases.INTERNAL_SERVER_ERROR,
        message: "MongoDB update failed",
      });
    }
  });

  // update number of posts in the subgreddiit
  SubGreddiit.findOneAndUpdate(
    { name: subgr },
    { $inc: { num_posts: 1 } },
    (err, doc) => {
      if (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
          error: ReasonPhrases.INTERNAL_SERVER_ERROR,
          message: "MongoDB update failed",
        });
      }
    }
  );

  // return response with isCensored field
  return res
    .status(StatusCodes.CREATED)
    .send({ message: "Post successfully created", isCensored: isCensored });
};

const getPosts = async (req, res) => {};

/// @POST /psot/comment/:subgr/:postid
/// Add a comment to a post
/// Logged in, user has joined subgr
const makeComment = async (req, res) => {
  const subgr = req.params.subgr;
  const postId = req.params.id;
  const commentText = req.body.text;

  // check if comment text is provided with request
  if (!commentText) {
    return res.status(StatusCodes.BAD_REQUEST).send({
      error: ReasonPhrases.BAD_REQUEST,
      message: "Please provide the comment text",
    });
  }

  // check if user is in the subgreddiit and is not banned
  const foundSubgr = await SubGreddiit.findOne(
    { name: subgr },
    { followers: 1, banned_keywords: 1 }
  );
  if (
    !foundSubgr.followers.some(
      (item) => item.username === req.user && item.blocked === false
    )
  ) {
    return res.status(StatusCodes.FORBIDDEN).send({
      error: ReasonPhrases.FORBIDDEN,
      message: "You are not part of this subgreddiit or have been blocked",
    });
  }

  // Check if post exists
  const foundPost = await Post.findOne({ id: postId }, { title: 1 });
  if (!foundPost) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ error: ReasonPhrases.BAD_REQUEST, message: "Post not found" });
  }

  // censor banned keywords
  // the regex is /bannedword1|bannedword2|bannedword3/gi
  const filter = new RegExp(`${foundSubgr.banned_keywords.join("|")}`, "gi");
  const censoredText = commentText.replace(filter, "****");
  const isCensored = censoredText !== commentText;

  // add comment
  const newComment = {
    username: req.user,
    comment_text: censoredText,
  };
  Post.findOneAndUpdate(
    { id: postId },
    { $push: { comments: newComment } },
    function (err, doc) {
      if (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
          error: ReasonPhrases.INTERNAL_SERVER_ERROR,
          message: "MongoDB update failed",
        });
      }
    }
  );

  // Done
  return res
    .status(StatusCodes.CREATED)
    .send({ message: "Comment added successfully", isCensored: isCensored });
};

/// @GET /post/save/:subgr/:postId
/// Save a post
/// Logged in, user joined subgreddiit and not banned
const savePost = async (req, res) => {
  const subgr = req.params.subgr;
  const postId = req.params.id;

  // Verify user has not saved the post already
  const foundUser = await User.findOne(
    { username: req.user },
    { saved_posts: 1 }
  );
  if (foundUser.saved_posts.includes(postId)) {
    return res.status(StatusCodes.BAD_REQUEST).send({
      error: ReasonPhrases.BAD_REQUEST,
      message: "You have already saved this post",
    });
  }

  //! verify post is in the subgreddiit
  const foundPost = await Post.findOne({ id: postId }, { posted_in: 1 });
  if (foundPost.posted_in !== subgr) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({
        error: ReasonPhrases.BAD_REQUEST,
        message: "This post does not exist in this subgreddiit",
      });
  }

  // Verify user is in subgreddiit and not blocked
  const foundSubgr = await SubGreddiit.findOne(
    { name: subgr },
    { followers: 1, banned_keywords: 1 }
  );
  if (
    !foundSubgr.followers.some(
      (item) => item.username === req.user && item.blocked === false
    )
  ) {
    return res.status(StatusCodes.FORBIDDEN).send({
      error: ReasonPhrases.FORBIDDEN,
      message: "You are not part of this subgreddiit or have been blocked",
    });
  }

  // Add post to users saved posts list
  User.findOneAndUpdate(
    { username: req.user },
    { $push: { saved_posts: postId } },
    (err, raw) => {
      if (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
          error: ReasonPhrases.INTERNAL_SERVER_ERROR,
          message: "MongoDB update failed",
        });
      }
    }
  );

  // Done
  return res
    .status(StatusCodes.OK)
    .send({ message: "Post saved successfully" });
};

const unsavePost = async (req, res) => {
  const postId = req.params.id;

  // check if user has saved this post
  const foundUser = await User.findOne(
    { username: req.user },
    { saved_posts: 1 }
  );
  if (!foundUser.saved_posts.includes(postId)) {
    return res.status(StatusCodes.BAD_REQUEST).send({
      error: ReasonPhrases.BAD_REQUEST,
      message: "You have not saved this post",
    });
  }

  // remove the post from the saved posts list
  User.findOneAndUpdate(
    { username: req.user },
    { $pull: { saved_posts: postId } },
    (err, raw) => {
      if (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
          error: ReasonPhrases.INTERNAL_SERVER_ERROR,
          message: "MongoDB update failed",
        });
      }
    }
  );

  // done
  return res
    .status(StatusCodes.OK)
    .send({ message: "Post successfully unsaved" });
};

module.exports = { createPost, getPosts, makeComment, savePost, unsavePost };
