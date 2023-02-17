const mongoose = require("mongoose");
const SubGreddiit = require("../models/SubGreddiitModel");
const User = require("../models/UserModel");
const StatusCodes = require("http-status-codes").StatusCodes;
const ReasonPhrases = require("http-status-codes").ReasonPhrases;

/// @POST /gr/create
/// Create a subgreddiit
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
    return res.status(StatusCodes.CONFLICT).send({
      error: ReasonPhrases.CONFLICT,
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
    image: req.body.image || "",
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

/// @GET /gr/info/:subgr
/// get information about the subgr
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
      __v: 0,
      name: 1,
      description: 1,
      banned_keywords: 1,
      num_posts: 1,
      num_people: 1,
      creator: 1,
      createdAt: 1,
      image: 1
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

/// @GET /gr/users/:subgr
/// Get the users of subgr
/// Only for moderator
const getSubUsers = async (req, res) => {
  const subgr = req.params.subgr;

  if (process.env.MODE === "dev") {
    console.log(getSubUsers);
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

  const foundSubgr = await SubGreddiit.findOne(
    { name: subgr },
    {
      followers: 1,
    }
  );

  // if (!foundSubgr) {
  //   return res.status(StatusCodes.BAD_REQUEST).send({
  //     error: ReasonPhrases.BAD_REQUEST,
  //     message: "Subgreddiit not found",
  //   });
  // }

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

/// @DELETE /gr/delete/:subgr
/// Delete a subgreddiit
/// Only for moderator
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

  SubGreddiit.findOneAndDelete({ name: subgr }, function (err, raw) {
    if (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        error: ReasonPhrases.INTERNAL_SERVER_ERROR,
        message: "MongoDB update failed",
      });
    }
  });

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

/// @PATCH gr/jreq/:subgr
/// Change status of a join request
/// Only for moderator
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

/// @POST gr/jreq/:subgr
/// Send a join request from current user
/// to the moderator of the subgr
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

  // check if user has left this subgreddiit before
  // do not allow joining request if they have left this subgreddiit before
  const foundUser = await User.findOne(
    { username: req.user },
    { left_subgreddiits: 1 }
  );
  if (foundUser.left_subgreddiits.includes(subgr)) {
    return res.status(StatusCodes.FORBIDDEN).send({
      error: ReasonPhrases.FORBIDDEN,
      message: "You have left this subgreddiit already",
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

/// @GET /gr/leave/:subgr
/// Leave a subgreddiit
// Only for not moderator
const leaveSubgreddiit = async (req, res) => {
  if (process.env.MODE === "dev") {
    console.log("Leave subgreddiit");
  }

  const subgr = req.params.subgr;

  const foundSubgr = await SubGreddiit.findOne(
    { name: subgr },
    { followers: 1, creator: 1, num_people: 1 }
  );

  // check if valid subgreddiit
  if (!foundSubgr) {
    return res.status(StatusCodes.BAD_REQUEST).send({
      error: ReasonPhrases.BAD_REQUEST,
      message: "Subgreddiit does not exist",
    });
  }

  // Don't allow moderator to leave
  if (req.user === foundSubgr.creator) {
    return res.status(StatusCodes.FORBIDDEN).send({
      error: ReasonPhrases.FORBIDDEN,
      message:
        "You are the moderator of this subgreddiit. Try deleting it instead.",
    });
  }

  // Check if they are part of the subgreddiit
  if (!foundSubgr.followers.some((item) => item.username === req.user)) {
    return res.status(StatusCodes.FORBIDDEN).send({
      error: StatusCodes.FORBIDDEN,
      message: "You are not part of this subgredddiit",
    });
  }

  // They are part of the subgreddiit and not moderator
  // Let them leave and add the subgreddiit to their left subgreddiits list
  User.findOneAndUpdate(
    { username: req.user },
    { $push: { left_subgreddiits: subgr } },
    function (err, raw) {
      if (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
          error: ReasonPhrases.INTERNAL_SERVER_ERROR,
          message: "MongoDB update failed",
        });
      }
    }
  );

  foundSubgr.num_people -= 1;
  foundSubgr.followers = foundSubgr.followers.filter(
    (item) => item.username !== req.user
  );
  foundSubgr.save((err, raw) => {
    if (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        error: ReasonPhrases.INTERNAL_SERVER_ERROR,
        message: "MongoDB update failed",
      });
    }
  });

  return res.status(StatusCodes.OK).send({ message: "Left subgreddiit" });
};

/// @GET /gr/ismod/:subgr
/// Check if requesting user is moderator of subgr
/// OK if mod, FORBIDDEN if not
const isSubMod = async (req, res) => {
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
    .send({ message: "You are the moderator of this subgreddiit" });
};

/// @GET /gr/mysubs
/// List of all subgreddiits created by requesting user
const mySubgreddiits = async (req, res) => {
  const username = req.user;

  const foundSubs = await SubGreddiit.find(
    { creator: username },
    { _id: 0, __v: 0 }
  )
    .lean()
    .exec();

  return res.status(StatusCodes.OK).send(foundSubs);
};

/// @GET /gr/all
/// List of all subgreddiits
/// Separated into joined and not joined
const getAllSubs = async (req, res) => {
  const username = req.user;

  const allSubs = await SubGreddiit.find({}, { _id: 0, __v: 0, createdAt: 0 })
    .lean()
    .exec();

  const checkFollower = (followers) => {
    if (
      followers.find(
        (follower) =>
          follower.username === username && follower.blocked === false
      )
    ) {
      return true;
    } else {
      return false;
    }
  };

  const joinedSubs = allSubs.filter((item) => checkFollower(item.followers));

  const notJoinedSubs = allSubs.filter(
    (item) => !checkFollower(item.followers)
  );

  return res
    .status(StatusCodes.OK)
    .send({ joined_subs: joinedSubs, not_joined_subs: notJoinedSubs });
};

module.exports = {
  createSubgreddiit,
  getSubInfo,
  getSubUsers,
  deleteSubgreddiit,
  getJoinRequests,
  patchJoinRequests,
  addJoinRequest,
  leaveSubgreddiit,
  isSubMod,
  mySubgreddiits,
  getAllSubs,
};
