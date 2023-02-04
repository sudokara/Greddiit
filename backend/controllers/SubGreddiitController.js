const mongoose = require("mongoose");
const SubGreddiit = require("../models/SubGreddiitModel");
const StatusCodes = require("http-status-codes").StatusCodes;
const ReasonPhrases = require("http-status-codes").ReasonPhrases;

const createSubgreddiit = async (req, res) => {
  if (process.env.MODE === "dev") {
    console.log("Create subgreddiit");
  }

  // I know theres a better way, that I've even used elsewhere but that method always gives me http headers sent error
  // Yes i know what causes that error in general
  // No i could not debug it
  // Bear with this now
  if (
    !req.body.name ||
    !req.body.description ||
    !req.body.tags ||
    !req.body.banned_keywords
  ) {
    return res.status(StatusCodes.BAD_REQUEST).send({
      error: ReasonPhrases.BAD_REQUEST,
      message: "Please fill all fields",
    });
  }

  // handle duplicate name
  const duplicateSg = await SubGreddiit.findOne({ name: req.body.name });
  //   console.log(duplicateSg);
  if (duplicateSg) {
    return res.status(StatusCodes.BAD_REQUEST).send({
      error: ReasonPhrases.BAD_REQUEST,
      message: "SubGreddiit with the same name already exists",
    });
  }

  const newSg = new SubGreddiit({
    name: req.body.name,
    description: req.body.description,
    tags: req.body.tags,
    banned_keywords: req.body.banned_keywords,
    creator: req.user,
    followers: [
      {
        username: req.user,
        blocked: false,
      },
    ],
  });

  newSg.save((err, doc) => {
    if (err) {
      return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR).send({
        error: ReasonPhrases.INTERNAL_SERVER_ERROR,
        message: "MongoDB update failed",
      });
    }
  });

  return res
    .status(StatusCodes.CREATED)
    .send({ message: "Subgreddiit created" });
};

const getSubInfo = async (req, res) => {
  if (process.env.MODE === "dev") {
    console.log("Get Subgreddiit info");
  }

  const subgr = req.params.subgr;
  //   console.log(subgr);

  const foundSubgr = await SubGreddiit.findOne(
    { name: subgr },
    {
      _id: 0,
      name: 1,
      description: 1,
      banned_keywords: 1,
      num_posts: 1,
      num_people: 1,
    }
  );

  if (!foundSubgr) {
    return res.status(StatusCodes.BAD_REQUEST).send({
      error: ReasonPhrases.BAD_REQUEST,
      message: "Subgreddiit not found",
    });
  }

  return res.status(200).send(foundSubgr);
};

const getSubUsers = async (req, res) => {
  if (process.env.MODE === "dev") {
    console.log(getSubUsers);
  }

  const subgr = req.params.subgr;
  const foundSubgr = await SubGreddiit.findOne(
    { name: subgr },
    {
      followers: 1,
    }
  );

  if (!foundSubgr) {
    return res.status(StatusCodes.BAD_REQUEST).send({
      error: ReasonPhrases.BAD_REQUEST,
      message: "Subgreddiit not found",
    });
  }

  const followersObj = foundSubgr.followers.filter(
    (item) => item.blocked === false
  );
  const blockedFollowersObj = foundSubgr.followers.filter(
    (item) => item.blocked === true
  );

  console.log(followersObj);
  console.log(blockedFollowersObj);

  return res.status(StatusCodes.OK).send({
    unblocked_followers: followersObj,
    blocked_followers: blockedFollowersObj,
  });
};

/// Verify if user is a Moderator
const verifyModerator = async (username, subgr) => {
  console.log(subgr);
  const foundSubgr = await SubGreddiit.findOne(
    { name: subgr },
    { _id: 0, joining_requests: 1, creator: 1 }
  );
  if (!foundSubgr) {
    return StatusCodes.BAD_REQUEST;
  }

  if (username !== foundSubgr.creator) {
    return StatusCodes.FORBIDDEN;
  }
};

/// Delete a subgreddiit
const deleteSubgreddiit = async (req, res) => {
  if (process.env.MODE === "dev") {
    console.log("Delete subgreddiit");
  }
  //! delete reports and posts also

  const subgr = req.params.subgr;
  const modStatus = await verifyModerator(req.user, subgr);

  if (modStatus === StatusCodes.BAD_REQUEST) {
    return res.status(StatusCodes.BAD_REQUEST).send({
      error: StatusCodes.BAD_REQUEST,
      message: "Could not find subgreddiit",
    });
  }

  if (modStatus === StatusCodes.FORBIDDEN) {
    return res.status(StatusCodes.FORBIDDEN).send({
      error: ReasonPhrases.FORBIDDEN,
      message: "You are not the moderator of this subgreddiit",
    });
  }

  return res
    .status(StatusCodes.OK)
    .send({ message: "Functionality incomplete" });
};

/// Get pending join requests
/// Only for moderator
/// GET @/gr/jreq/:subgr
const getJoinRequests = async (req, res) => {
  if (process.env.MODE === "dev") {
    console.log("Fetch Join Requests");
  }

  const subgr = req.params.subgr;

  // verify if the requester is moderator
  const modStatus = await verifyModerator(req.user, subgr);
  if (modStatus === StatusCodes.BAD_REQUEST) {
    return res.status(StatusCodes.BAD_REQUEST).send({
      error: StatusCodes.BAD_REQUEST,
      message: "Could not find subgreddiit",
    });
  }
  if (modStatus === StatusCodes.FORBIDDEN) {
    return res.status(StatusCodes.FORBIDDEN).send({
      error: ReasonPhrases.FORBIDDEN,
      message: "You are not the moderator of this subgreddiit",
    });
  }

  const foundSubgr = await SubGreddiit.findOne(
    { name: subgr },
    { _id: 0, joining_requests: 1 }
  );

  return res
    .status(StatusCodes.OK)
    .send(
      foundSubgr.joining_requests.filter((item) => item.status === "pending")
    );
};

/// Change status of a join request
/// Only for moderator
/// PATCH @gr/jreq/:subgr
const patchJoinRequests = async (req, res) => {
  const username = req.body.username?.toLowerCase();
  const status = req.body.status?.toLowerCase();
  const subgr = req.params.subgr;

  if (!username || !status) {
    return res.status(StatusCodes.BAD_REQUEST).send({
      error: ReasonPhrases.BAD_REQUEST,
      message: "Please provide all fields",
    });
  }

  // verify if the requester is moderator
  const modStatus = await verifyModerator(req.user, subgr);
  if (modStatus === StatusCodes.BAD_REQUEST) {
    return res.status(StatusCodes.BAD_REQUEST).send({
      error: StatusCodes.BAD_REQUEST,
      message: "Could not find subgreddiit",
    });
  }
  if (modStatus === StatusCodes.FORBIDDEN) {
    return res.status(StatusCodes.FORBIDDEN).send({
      error: ReasonPhrases.FORBIDDEN,
      message: "You are not the moderator of this subgreddiit",
    });
  }

  const thisSubgr = await SubGreddiit.findOne(
    { name: subgr },
    { joining_requests: 1 }
  );
  const jreqs = thisSubgr.joining_requests;

  if (
    !jreqs.some(
      (item) => item.username === username && item.status === "pending"
    )
  ) {
    return res.status(StatusCodes.BAD_REQUEST).send({
      error: ReasonPhrases.BAD_REQUEST,
      message: "No pending join request found for that user",
    });
  }

  if (status === "accepted") {
    if (process.env.MODE === "dev") {
      console.log("accepted join request");
    }

    // remove join request
    thisSubgr.joining_requests = jreqs.filter(
      (item) => item.username !== username
    );
    thisSubgr.save((err, doc) => {
      if (err) {
        console.error(err);
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .send({ error: err, message: "MongoDB update failed" });
      }
    });

    // update followers list
    SubGreddiit.findOneAndUpdate(
      { name: subgr },
      {
        $push: {
          followers: { username: username, blocked: false },
        },
        $inc: { num_people: 1 },
      },
      function (err, raw) {
        if (err) {
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            error: ReasonPhrases.INTERNAL_SERVER_ERROR,
            message: "MongoDB update failed",
          });
        }
      }
    );
  } else if (status === "rejected") {
    console.log("rejected join request");

    // change status to rejected
    thisSubgr.joining_requests = jreqs.map((item) =>
      item.username === username ? { ...item, status: "rejected" } : item
    );
    thisSubgr.save((err, doc) => {
      if (err) {
        console.error(err);
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .send({ error: err, message: "MongoDB update failed" });
      }
    });
  } else {
    return res.status(StatusCodes.BAD_REQUEST).send({
      error: ReasonPhrases.BAD_REQUEST,
      message: "Invalid joining request status",
    });
  }

  return res.status(StatusCodes.OK).send("Modified joining status");
};

const addJoinRequest = async (req, res) => {
  // find subgreddiit and check if it exists
  const subgr = req.params.subgr;
  const foundSubgr = await SubGreddiit.findOne(
    { name: subgr },
    { _id: 0, joining_requests: 1, creator: 1, followers: 1 }
  );
  if (!foundSubgr) {
    return res.status(StatusCodes.BAD_REQUEST).send({
      error: ReasonPhrases.BAD_REQUEST,
      message: "Subgreddiit not found",
    });
  }

  // check if moderator
  if (req.user === foundSubgr.creator) {
    return res.status(StatusCodes.FORBIDDEN).send({
      error: ReasonPhrases.FORBIDDEN,
      message: "You are the moderator of this subgreddiit",
    });
  }

  // check if pending joining request
  if (foundSubgr.joining_requests.some((item) => item.username === req.user)) {
    return res.status(StatusCodes.BAD_REQUEST).send({
      error: ReasonPhrases.BAD_REQUEST,
      message: "Joining request already exists",
    });
  }

  if (foundSubgr.followers.some((item) => item.username === req.user)) {
    return res.status(StatusCodes.FORBIDDEN).send({
      error: ReasonPhrases.FORBIDDEN,
      message: "You have already joined this subgreddiit",
    });
  }
  // add the joining request
  SubGreddiit.findOneAndUpdate(
    { name: subgr },
    {
      $push: { joining_requests: { username: req.user, status: "pending" } },
    },
    function (err, raw) {
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
    .send({ message: "Joining request made" });
};

module.exports = {
  createSubgreddiit,
  getSubInfo,
  getSubUsers,
  deleteSubgreddiit,
  getJoinRequests,
  patchJoinRequests,
  addJoinRequest,
};