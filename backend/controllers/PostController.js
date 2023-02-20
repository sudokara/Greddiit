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

  // check if any censored words are in the title or text
  // the regex is /bannedword1|bannedword2|bannedword3/gi
  const filter = new RegExp(`${foundSubgr.banned_keywords.join("|")}`, "gi");
  // const censoredText = postText.replace(filter, "****");
  // const censoredTitle = postTitle.replace(filter, "****");
  // const isCensored = postText !== censoredText || postTitle !== censoredTitle;
  const isCensored = filter.test(postText) || filter.test(postTitle);

  // add the post to the subgreddiit
  // user who makes the post auto upvotes it
  const newPost = new Post({
    title: postTitle,
    text: postText,
    posted_by: req.user,
    posted_in: subgr,
    upvotes: [req.user],
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

/// @GET /post/:subgr
/// Get all the posts in the sub
/// Censors post texts
const getPosts = async (req, res) => {
  const subgr = req.params.subgr;
  const username = req.user;

  const foundSubgr = await SubGreddiit.findOne(
    { name: subgr },
    { banned_keywords: 1 }
  );

  // check if sub exists
  if (!foundSubgr) {
    return res.status(StatusCodes.BAD_REQUEST).send({
      error: ReasonPhrases.BAD_REQUEST,
      message: "Subgreddiit not found",
    });
  }

  // find the posts
  const foundPosts = await Post.find({ posted_in: subgr }).lean().exec();

  // censor banned keywords
  const toCensor = foundSubgr.banned_keywords.length;
  if (toCensor) {
    const filter = new RegExp(`${foundSubgr.banned_keywords.join("|")}`, "gi");
    const censoredPosts = foundPosts.map((item) => ({
      ...item,
      title: item.title.replace(filter, "****"),
      text: item.text.replace(filter, "****"),
      comments: item.comments.map((comment) => ({
        ...comment,
        comment_text: comment.comment_text.replace(filter, "****"),
      })),
    }));

    // return results
    return res.status(StatusCodes.OK).send(censoredPosts);
  } else {
    return res.status(StatusCodes.OK).send(foundPosts);
  }
};

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

  // verify post is in the subgreddiit
  const foundPost = await Post.findOne({ id: postId }, { posted_in: 1 });
  if (foundPost.posted_in !== subgr) {
    return res.status(StatusCodes.BAD_REQUEST).send({
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

/// @GET /post/unsave/:subgr/:postId
/// Unsave a saved post
/// Logged in, post is saved
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

/// @GET /post/upvote/:subgr/:postId
/// Upvote a post
/// Must be logged in and part of the subgreddiit
const upvotePost = async (req, res) => {
  const subgr = req.params.subgr;
  const postId = req.params.id;

  // chek if post exists
  // check if post has already been upvoted/downvoted
  const foundPost = await Post.findOne(
    { id: postId },
    { upvotes: 1, downvotes: 1, posted_in: 1 }
  );
  if (!foundPost) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ error: ReasonPhrases.BAD_REQUEST, message: "Post not found" });
  }
  if (foundPost.posted_in !== subgr) {
    return res.status(StatusCodes.BAD_REQUEST).send({
      error: ReasonPhrases.BAD_REQUEST,
      message: "This post is not in this subgreddiit",
    });
  }

  // already upvoted this post
  if (foundPost.upvotes.includes(req.user)) {
    return res.status(StatusCodes.FORBIDDEN).send({
      error: ReasonPhrases.FORBIDDEN,
      message: "You have already upvoted this post",
    });
  }

  // already downvoted this post
  // remove the downvote and add an upvote
  if (foundPost.downvotes.includes(req.user)) {
    Post.findOneAndUpdate(
      { id: postId },
      { $pull: { downvotes: req.user }, $push: { upvotes: req.user } },
      (err, raw) => {
        if (err) {
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            error: ReasonPhrases.INTERNAL_SERVER_ERROR,
            message: "MongoDB update failed",
          });
        }
      }
    );
    return res
      .status(StatusCodes.CREATED)
      .send({ message: "Post upvoted successfully" });
  }

  // check if user part of subgreddiit and is not blocked
  const foundSubgr = await SubGreddiit.findOne(
    { name: subgr },
    { followers: 1 }
  );
  if (
    !foundSubgr.followers.some(
      (item) => item.username === req.user && item.blocked === false
    )
  ) {
    return res.status(StatusCodes.FORBIDDEN).send({
      error: ReasonPhrases.FORBIDDEN,
      message: "You are not part of this subgreddiit or are blocked",
    });
  }

  // upvote
  Post.findOneAndUpdate(
    { id: postId },
    { $push: { upvotes: req.user } },
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
    .status(StatusCodes.CREATED)
    .send({ message: "Post upvoted successfully" });
};

/// @GET /post/unupvote/:subgr/:postId
/// Remove an upvote if present
/// Do nothing otherwise
const removeUpvote = async (req, res) => {
  const subgr = req.params.subgr;
  const postId = req.params.id;

  // chek if post exists
  // check if post has already been upvoted/downvoted
  const foundPost = await Post.findOne(
    { id: postId },
    { upvotes: 1, downvotes: 1, posted_in: 1 }
  );
  if (!foundPost) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ error: ReasonPhrases.BAD_REQUEST, message: "Post not found" });
  }
  if (foundPost.posted_in !== subgr) {
    return res.status(StatusCodes.BAD_REQUEST).send({
      error: ReasonPhrases.BAD_REQUEST,
      message: "This post is not in this subgreddiit",
    });
  }

  // not upvoted this post
  if (!foundPost.upvotes.includes(req.user)) {
    return res.status(StatusCodes.FORBIDDEN).send({
      error: ReasonPhrases.FORBIDDEN,
      message: "You have not upvoted this post",
    });
  }

  // already downvoted this post
  // do nothing
  if (foundPost.downvotes.includes(req.user)) {
    return res
      .status(StatusCodes.OK)
      .send({ message: "Post already downvoted" });
  }

  // check if user part of subgreddiit and is not blocked
  const foundSubgr = await SubGreddiit.findOne(
    { name: subgr },
    { followers: 1 }
  );
  if (
    !foundSubgr.followers.some(
      (item) => item.username === req.user && item.blocked === false
    )
  ) {
    return res.status(StatusCodes.FORBIDDEN).send({
      error: ReasonPhrases.FORBIDDEN,
      message: "You are not part of this subgreddiit or are blocked",
    });
  }

  // remove upvote
  Post.findOneAndUpdate(
    { id: postId },
    { $pull: { upvotes: req.user } },
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
    .status(StatusCodes.CREATED)
    .send({ message: "Post un-upvoted successfully" });
};

/// @GET /post/downvote/:subgr/:postId
/// Downvote a post
/// Must be logged in, part of subgreddiit
const downvotePost = async (req, res) => {
  const subgr = req.params.subgr;
  const postId = req.params.id;

  // chek if post exists
  // check if post has already been upvoted/downvoted
  const foundPost = await Post.findOne(
    { id: postId },
    { upvotes: 1, downvotes: 1, posted_in: 1 }
  );
  if (!foundPost) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ error: ReasonPhrases.BAD_REQUEST, message: "Post not found" });
  }
  if (foundPost.posted_in !== subgr) {
    return res.status(StatusCodes.BAD_REQUEST).send({
      error: ReasonPhrases.BAD_REQUEST,
      message: "This post is not in this subgreddiit",
    });
  }

  // already downvoted this post
  if (foundPost.downvotes.includes(req.user)) {
    return res.status(StatusCodes.FORBIDDEN).send({
      error: ReasonPhrases.FORBIDDEN,
      message: "You have already downvoted this post",
    });
  }

  // already upvoted this post
  // remove the upvote and add a downvote
  if (foundPost.upvotes.includes(req.user)) {
    Post.findOneAndUpdate(
      { id: postId },
      { $pull: { upvotes: req.user }, $push: { downvotes: req.user } },
      (err, raw) => {
        if (err) {
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            error: ReasonPhrases.INTERNAL_SERVER_ERROR,
            message: "MongoDB update failed",
          });
        }
      }
    );
    return res
      .status(StatusCodes.CREATED)
      .send({ message: "Post downvoted successfully" });
  }

  // check if user part of subgreddiit and is not blocked
  const foundSubgr = await SubGreddiit.findOne(
    { name: subgr },
    { followers: 1 }
  );
  if (
    !foundSubgr.followers.some(
      (item) => item.username === req.user && item.blocked === false
    )
  ) {
    return res.status(StatusCodes.FORBIDDEN).send({
      error: ReasonPhrases.FORBIDDEN,
      message: "You are not part of this subgreddiit or are blocked",
    });
  }

  // downvote
  Post.findOneAndUpdate(
    { id: postId },
    { $push: { downvotes: req.user } },
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
    .status(StatusCodes.CREATED)
    .send({ message: "Post downvoted successfully" });
};

/// @GET /post/undownvote/:subgr/:postId
/// Remove a downvote if present
/// Do nothing otherwise
const removeDownvote = async (req, res) => {
  const subgr = req.params.subgr;
  const postId = req.params.id;

  // chek if post exists
  // check if post has already been upvoted/downvoted
  const foundPost = await Post.findOne(
    { id: postId },
    { upvotes: 1, downvotes: 1, posted_in: 1 }
  );
  if (!foundPost) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ error: ReasonPhrases.BAD_REQUEST, message: "Post not found" });
  }
  if (foundPost.posted_in !== subgr) {
    return res.status(StatusCodes.BAD_REQUEST).send({
      error: ReasonPhrases.BAD_REQUEST,
      message: "This post is not in this subgreddiit",
    });
  }

  // already downvoted this post
  if (!foundPost.downvotes.includes(req.user)) {
    return res.status(StatusCodes.FORBIDDEN).send({
      error: ReasonPhrases.FORBIDDEN,
      message: "You have not downvoted this post",
    });
  }

  // already upvoted this post
  // do nothing
  if (foundPost.upvotes.includes(req.user)) {
    return res.status(StatusCodes.OK).send({ message: "Post already upvoted" });
  }

  // check if user part of subgreddiit and is not blocked
  const foundSubgr = await SubGreddiit.findOne(
    { name: subgr },
    { followers: 1 }
  );
  if (
    !foundSubgr.followers.some(
      (item) => item.username === req.user && item.blocked === false
    )
  ) {
    return res.status(StatusCodes.FORBIDDEN).send({
      error: ReasonPhrases.FORBIDDEN,
      message: "You are not part of this subgreddiit or are blocked",
    });
  }

  // remove downvote
  Post.findOneAndUpdate(
    { id: postId },
    { $pull: { downvotes: req.user } },
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
    .status(StatusCodes.CREATED)
    .send({ message: "Post downvoted successfully" });
};

module.exports = {
  createPost,
  getPosts,
  makeComment,
  savePost,
  unsavePost,
  upvotePost,
  removeUpvote,
  downvotePost,
  removeDownvote
};
