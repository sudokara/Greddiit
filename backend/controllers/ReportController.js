const Report = require("../models/ReportModel");
const SubGreddiit = require("../models/SubGreddiitModel");
const Post = require("../models/PostModel");
const User = require("../models/UserModel");
const StatusCodes = require("http-status-codes").StatusCodes;
const ReasonPhrases = require("http-status-codes").ReasonPhrases;

/// @POST report
/// Make a new report
/// Reporter is sender of request, must have joined the subgreddit
const createReport = async (req, res) => {
  const reported_by = req.user;
  const properties = ["concern", "subgreddiit", "post_id"];
  const hasAllProps = properties.every((item) => req.body.hasOwnProperty(item));

  if (!hasAllProps) {
    return res.StatusCodes(StatusCodes.BAD_REQUEST).send({
      error: ReasonPhrases.BAD_REQUEST,
      message: "Please provide all fields",
    });
  }

  // check if user in sub
  const foundSubgr = await SubGreddiit.findOne(
    { name: req.body.subgreddiit },
    { followers: 1, banned_keywords: 1 }
  );
  if (
    !foundSubgr ||
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
  const foundPost = await Post.findOne(
    { id: req.body.post_id },
    { text: 1, posted_by: 1 }
  );
  if (!foundPost) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ error: ReasonPhrases.BAD_REQUEST, message: "Post not found" });
  }

  const reported_user = foundPost.posted_by;

  // check if duplicate
  const foundReport = await Report.findOne(
    {
      reported_by: reported_by,
      reported_user: reported_user,
      post_id: req.body.post_id,
    },
    { createdAt: 1 }
  )
    .lean()
    .exec();
  if (foundReport) {
    return res.status(StatusCodes.CONFLICT).send({
      error: ReasonPhrases.CONFLICT,
      message: "You have already reported this post",
    });
  }

  // Do not allow self report
  if (reported_by === reported_user) {
    return res.status(StatusCodes.BAD_REQUEST).send({
      error: ReasonPhrases.BAD_REQUEST,
      message: "You cannot report yourself",
    });
  }

  // make report with text of the post
  const newReport = new Report({
    reported_by: reported_by,
    reported_user: reported_user,
    concern: req.body.concern,
    post_text: foundPost.text,
    subgreddiit: req.body.subgreddiit,
    post_id: req.body.post_id,
    status: "pending",
  });
  newReport.save((err, doc) => {
    if (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        error: ReasonPhrases.INTERNAL_SERVER_ERROR,
        message: "MongoDB update failed",
      });
    }
  });

  // done
  return res
    .status(StatusCodes.CREATED)
    .send({ message: "Reported successfully" });
};

/// @PATCH /report
/// Ignore - change status to ignored
/// Delete post - remove report and delete post - reduce num posts
/// Block user - Change status of user, add to left subs, censor username in posts and comments
const takeAction = async (req, res) => {
  const reported_by = req.body?.reported_by;
  const reported_user = req.body?.reported_user;
  const post_id = req.body?.post_id;
  const action = req.body?.action;

  if (!reported_by || !reported_user || !post_id || !action) {
    return res.status(StatusCodes.BAD_REQUEST).send({
      error: ReasonPhrases.BAD_REQUEST,
      message: "Please provide all fields",
    });
  }

  // check if report exists
  const foundReport = await Report.findOne({
    reported_by: reported_by,
    reported_user: reported_user,
    post_id: post_id,
  })
    .lean()
    .exec();

  if (!foundReport) {
    return res.status(StatusCodes.BAD_REQUEST).send({
      error: ReasonPhrases.BAD_REQUEST,
      message: "The report was not found",
    });
  }

  if (foundReport.status !== "pending") {
    return res.status(StatusCodes.BAD_REQUEST).send({
      error: ReasonPhrases.BAD_REQUEST,
      message: "Action has already been taken",
    });
  }

  if (action !== "ignore" && action !== "delete" && action !== "block") {
    // if action is not either of these, bad request
    return res.status(StatusCodes.BAD_REQUEST).send({
      error: ReasonPhrases.BAD_REQUEST,
      message: "Invalid action requested",
    });
  }

  //? if ignored, change status to ignored
  if (action === "ignore") {
    Report.findOneAndUpdate(
      {
        reported_by: reported_by,
        reported_user: reported_user,
        post_id: post_id,
      },
      { status: "ignored" },
      function (err, doc) {
        if (err) {
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            error: ReasonPhrases.INTERNAL_SERVER_ERROR,
            message: "MongoDB update failed",
          });
        }
      }
    );

    return res.status(StatusCodes.OK).send({ message: "Report ignored" });
  }

  //? if delete post, remove the request, delete the post and decrement number of posts in the sub
  if (action === "delete") {
    Post.findOneAndDelete({ id: post_id }, function (err, doc) {
      if (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
          error: ReasonPhrases.INTERNAL_SERVER_ERROR,
          message: "MongoDB update failed",
        });
      }
    });

    SubGreddiit.findOneAndUpdate(
      { name: foundReport.subgreddiit },
      { $inc: { num_posts: -1 } },
      function (err, doc) {
        if (err) {
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            error: ReasonPhrases.INTERNAL_SERVER_ERROR,
            message: "MongoDB update failed",
          });
        }
      }
    );

    Report.findOneAndDelete(
      {
        reported_by: reported_by,
        reported_user: reported_user,
        post_id: post_id,
      },
      function (err, doc) {
        if (err) {
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            error: ReasonPhrases.INTERNAL_SERVER_ERROR,
            message: "MongoDB update failed",
          });
        }
      }
    );

    return res.status(StatusCodes.OK).send({ message: "Post deleted" });
  }

  // if block user, change status to blocked, add to left_subgreddiits list, censor name in posts and comments
  // check if accused is moderator
  if (action === "block") {
    const foundSubgr = await SubGreddiit.findOne(
      { name: foundReport.subgreddiit },
      { creator: 1, followers: 1, num_people: 1 }
    );

    if (reported_user === foundSubgr.creator) {
      return res.status(StatusCodes.FORBIDDEN).send({
        error: ReasonPhrases.FORBIDDEN,
        message: "Moderator of the subgreddiit cannot be blocked",
      });
    }

    // censor name in posts and comments
    Post.updateMany(
      { posted_by: reported_user },
      {
        posted_by: "blocked_user",
        // comments: comments.map((comment) =>
        //   comment.username === reported_user
        //     ? { ...comment, username: "blocked_user" }
        //     : comment
        // ),
      },
      function (err, doc) {
        if (err) {
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            error: ReasonPhrases.INTERNAL_SERVER_ERROR,
            message: "MongoDB update failed",
          });
        }
      }
    );

    // change status to blocked
    //! reduce number of people?
    foundSubgr.followers = foundSubgr.followers.map((item) =>
      item.username === reported_user ? { ...item, status: "blocked" } : item
    );
    foundSubgr.num_people -= 1;
    foundSubgr.save((err, doc) => {
      if (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
          error: ReasonPhrases.INTERNAL_SERVER_ERROR,
          message: "MongoDB update failed",
        });
      }
    });

    // add to left_subs
    User.findOneAndUpdate(
      { username: reported_user },
      { $push: { left_subgreddiits: foundReport.subgreddiit } }
    );

    // modify status of report
    Report.findOneAndUpdate(
      {
        reported_by: reported_by,
        reported_user: reported_user,
        post_id: post_id,
      },
      { status: "blocked" },
      function (err, doc) {
        if (err) {
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            error: ReasonPhrases.INTERNAL_SERVER_ERROR,
            message: "MongoDB update failed",
          });
        }
      }
    );

    // done
    return res.status(StatusCodes.OK).send({ message: "User blocked" });
  }
};

/// @GET /report/:subgr
/// Get the reports for a subgreddiit
/// Only for moderator
const getReports = async (req, res) => {
  const subgr = req.params.subgr;
  const username = req.user;

  // Check if sub exists and user is moderator
  const foundSubgr = await SubGreddiit.findOne({ name: subgr }, { creator: 1 })
    .lean()
    .exec();

  if (!foundSubgr) {
    return res.status(StatusCodes.BAD_REQUEST).send({
      error: ReasonPhrases.BAD_REQUEST,
      message: "Could not find subgreddiit",
    });
  }
  if (foundSubgr.creator !== username) {
    return res.status(StatusCodes.FORBIDDEN).send({
      error: ReasonPhrases.FORBIDDEN,
      message: "You are not the moderator of this subgreddiit",
    });
  }

  // Get the list of reports for that subgreddiit
  const foundReports = await Report.find(
    { subgreddiit: subgr },
    { _id: 0, __v: 0 }
  )
    .lean()
    .exec();
  console.log(foundReports);

  // Return list
  return res.status(StatusCodes.OK).send(foundReports);
};

module.exports = { createReport, takeAction, getReports };
