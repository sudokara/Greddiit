const express = require("express");
const router = express.Router();
const PostController = require("../controllers/PostController");
const verifyJWT = require("../middleware/VerifyJWT");
const commentLimiter = require("../middleware/CommentRateLimiter");
const postLimiter = require("../middleware/PostRateLimiter");

router.use(verifyJWT);

router
  .route("/:subgr")
  .post(postLimiter, PostController.createPost)
  .get(PostController.getPosts);

router
  .route("/comment/:subgr/:id")
  .post(commentLimiter, PostController.makeComment);

router.route("/save/:subgr/:id").get(PostController.savePost);

router.route("/unsave/:subgr/:id").get(PostController.unsavePost);

router.route("/upvote/:subgr/:id").get(PostController.upvotePost);

router.route("/downvote/:subgr/:id").get(PostController.downvotePost);

module.exports = router;
