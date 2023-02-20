const mongoose = require("mongoose");
const UserModel = require("../models/UserModel");
const Post = require("../models/PostModel");
const httpstatuscodes = require("http-status-codes");
const bcrypt = require("bcrypt");

/* const addFollower = async (req, res) => {
  console.log("add follower");
  const username = req.user;
  const follower = req.body.follower;

  const foundUser = await UserModel.findOne({ username: req.body.follower });

  // check if params given and follower exists
  if (!follower || !username || !foundUser) {
    return res.status(httpstatuscodes.StatusCodes.BAD_REQUEST).send({
      error: httpstatuscodes.ReasonPhrases.BAD_REQUEST,
      message: "Follower not found",
    });
  }

  //! check if already following
  const currentFollowers = await UserModel.findOne(
    { username: username },
    { followers: 1 }
  );

  console.log(currentFollowers.followers);

  if (currentFollowers.followers.includes(follower.toLowerCase())) {
    return res.status(httpstatuscodes.StatusCodes.BAD_REQUEST).send({
      error: httpstatuscodes.ReasonPhrases.BAD_REQUEST,
      message: "Alreaady following this user",
    });
  }

  UserModel.updateOne(
    { username: username },
    { $push: { followers: req.body.follower } },
    function (err, raw) {
      if (err) {
        return res
          .status(httpstatuscodes.StatusCodes.INTERNAL_SERVER_ERROR)
          .send({
            error: httpstatuscodes.ReasonPhrases.INTERNAL_SERVER_ERROR,
            message: "MongoDB update failed",
          });
      }
      console.log(raw);
    }
  );

  return res
    .status(httpstatuscodes.StatusCodes.OK)
    .send({ message: "Follower added" });
}; */

/// Follow a user
const addFollowing = async (req, res) => {
  console.log("Add following");

  const username = req.user;
  const following = req.body.following?.toLowerCase();

  if (!username || !following) {
    return res.status(httpstatuscodes.StatusCodes.BAD_REQUEST).send({
      error: httpstatuscodes.ReasonPhrases.BAD_REQUEST,
      message: "Follow request user not found",
    });
  }

  // get the list of following for this user and list of followers for the follower
  const thisUser = await UserModel.findOne(
    { username: username },
    { following: 1 }
  );
  const followingUser = await UserModel.findOne(
    { username: following },
    { followers: 1 }
  );

  if (!followingUser || !thisUser || username === following) {
    return res.status(httpstatuscodes.StatusCodes.BAD_REQUEST).send({
      error: httpstatuscodes.ReasonPhrases.BAD_REQUEST,
      message: "Follow request user not found or self request",
    });
  }

  if (thisUser.following.includes(following)) {
    if (followingUser.followers.includes(username)) {
      console.log("Already following each other");
      return res.status(httpstatuscodes.StatusCodes.BAD_REQUEST).send({
        error: httpstatuscodes.ReasonPhrases.BAD_REQUEST,
        message: "Already Following",
      });
    } else {
      console.log("Following but followers list unupdated");
      UserModel.updateOne(
        { username: following },
        { $push: { followers: username } },
        function (err, raw) {
          if (err) {
            return res
              .status(httpstatuscodes.StatusCodes.INTERNAL_SERVER_ERROR)
              .send({
                error: httpstatuscodes.ReasonPhrases.INTERNAL_SERVER_ERROR,
                message: "MongoDB update failed",
              });
          }
        }
      );

      return res
        .status(httpstatuscodes.StatusCodes.CREATED)
        .send({ message: "Following user" });
    }
  }

  console.log("Adding to following list");
  UserModel.updateOne(
    { username: username },
    {
      $push: { following: following },
    },
    function (err, raw) {
      if (err) {
        return res
          .status(httpstatuscodes.StatusCodes.INTERNAL_SERVER_ERROR)
          .send({
            error: httpstatuscodes.ReasonPhrases.INTERNAL_SERVER_ERROR,
            message: "MongoDB update failed",
          });
      }
      //   console.log(raw);
    }
  );

  console.log("Adding to following's follower list");
  UserModel.updateOne(
    { username: following },
    {
      $push: { followers: username },
    },
    function (err, raw) {
      if (err) {
        return res
          .status(httpstatuscodes.StatusCodes.INTERNAL_SERVER_ERROR)
          .send({
            error: httpstatuscodes.ReasonPhrases.INTERNAL_SERVER_ERROR,
            message: "MongoDB update failed",
          });
      }
      //   console.log(raw);
    }
  );

  return res
    .status(httpstatuscodes.StatusCodes.CREATED)
    .send({ message: "Following user" });
};

/// Remove a follower
const removeFollower = async (req, res) => {
  console.log("remove follower");
  const username = req.user;
  const follower = req.body.follower?.toLowerCase();

  // get the list of followers for this user and list of following for the follower
  const thisUser = await UserModel.findOne(
    { username: username },
    { followers: 1 }
  );
  const followerUser = await UserModel.findOne(
    { username: follower },
    { following: 1 }
  );

  // check if follower exists
  if (!username || !follower || !followerUser || username === follower) {
    return res.status(httpstatuscodes.StatusCodes.BAD_REQUEST).send({
      error: httpstatuscodes.ReasonPhrases.BAD_REQUEST,
      message: "Follower not found or self request",
    });
  }

  // if caller does not have the follower or the follower does not follow the user
  if (
    !followerUser.following.includes(username) ||
    !thisUser.followers.includes(follower)
  ) {
    return res.status(httpstatuscodes.StatusCodes.BAD_REQUEST).send({
      error: httpstatuscodes.ReasonPhrases.BAD_REQUEST,
      message: "Invalid follower/following combination",
    });
  }

  // remove follower from following list
  UserModel.updateOne(
    { username: username },
    { $pull: { followers: follower } },
    function (err, raw) {
      if (err) {
        return res
          .status(httpstatuscodes.StatusCodes.INTERNAL_SERVER_ERROR)
          .send({
            error: httpstatuscodes.ReasonPhrases.INTERNAL_SERVER_ERROR,
            message: "MongoDB update failed",
          });
      }
      //   console.log(raw);
    }
  );

  // remove user from follower's following list
  UserModel.updateOne(
    { username: follower },
    { $pull: { following: username } },
    function (err, raw) {
      if (err) {
        return res
          .status(httpstatuscodes.StatusCodes.INTERNAL_SERVER_ERROR)
          .send({
            error: httpstatuscodes.ReasonPhrases.INTERNAL_SERVER_ERROR,
            message: "MongoDB update failed",
          });
      }
    }
  );

  return res
    .status(httpstatuscodes.StatusCodes.OK)
    .send({ message: "Follower removed" });
};

const unFollow = async (req, res) => {
  const unfollow = req.body.unfollow?.toLowerCase();

  const unfollowUser = await UserModel.findOne({ username: unfollow }).lean();
  if (!unfollowUser || !unfollow || req.user === unfollow) {
    return res.status(httpstatuscodes.StatusCodes.BAD_REQUEST).send({
      error: httpstatuscodes.ReasonPhrases.BAD_REQUEST,
      message: "Unfollow user not found",
    });
  }

  UserModel.findOneAndUpdate(
    { username: req.user },
    { $pull: { following: unfollow } },
    function (err, raw) {
      if (err) {
        return res
          .status(httpstatuscodes.StatusCodes.INTERNAL_SERVER_ERROR)
          .send({
            error: httpstatuscodes.ReasonPhrases.INTERNAL_SERVER_ERROR,
            message: "MongoDB update failed",
          });
      }
    }
  );

  UserModel.findOneAndUpdate(
    { username: unfollow },
    { $pull: { followers: req.user } },
    function (err, raw) {
      if (err) {
        return res
          .status(httpstatuscodes.StatusCodes.INTERNAL_SERVER_ERROR)
          .send({
            error: httpstatuscodes.ReasonPhrases.INTERNAL_SERVER_ERROR,
            message: "MongoDB update failed",
          });
      }
    }
  );

  res
    .status(httpstatuscodes.StatusCodes.OK)
    .send({ message: "Unfollowed user" });
};

const editProfile = async (req, res) => {
  if (process.env.MODE === "dev") {
    console.log("Edit profile");
  }

  const properties = ["password", "firstname", "lastname", "contactnum"];
  const hasAllProps = properties.every((item) => req.body.hasOwnProperty(item));

  if (!hasAllProps) {
    return res.status(httpstatuscodes.StatusCodes.BAD_REQUEST).send({
      message: "Please fill required fields",
      error: httpstatuscodes.ReasonPhrases.BAD_REQUEST,
    });
  }

  bcrypt.hash(req.body.password, 10, function (err, hashedPassword) {
    if (err) {
      return res
        .status(httpstatuscodes.StatusCodes.INTERNAL_SERVER_ERROR)
        .send({
          error: httpstatuscodes.ReasonPhrases.INTERNAL_SERVER_ERROR,
          message: "Hashing password failed",
        });
    }

    UserModel.findOneAndUpdate(
      { username: req.user },
      {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        contactnum: req.body.contactnum,
        password: hashedPassword,
      },
      function (err, raw) {
        if (err) {
          return res
            .status(httpstatuscodes.StatusCodes.INTERNAL_SERVER_ERROR)
            .send({
              error: httpstatuscodes.ReasonPhrases.INTERNAL_SERVER_ERROR,
              message: "MongoDB update failed",
            });
        }
      }
    );
  });

  return res
    .status(httpstatuscodes.StatusCodes.OK)
    .send({ message: "Updated profile" });
};

const getProfile = async (req, res) => {
  const getUsername = req.params.username?.toLowerCase();
  if (process.env.MODE === "dev") {
    console.log("Get profile");
    console.log(getUsername);
  }

  const foundUser = await UserModel.findOne(
    { username: getUsername },
    { password: 0 }
  ).lean();

  if (!foundUser) {
    return res.status(httpstatuscodes.StatusCodes.BAD_REQUEST).send({
      error: httpstatuscodes.ReasonPhrases.BAD_REQUEST,
      message: "Could not find requested user",
    });
  }

  const isSelf = getUsername === req.user;

  return res.status(httpstatuscodes.StatusCodes.OK).send({
    username: foundUser.username,
    firstname: foundUser.firstname,
    lastname: foundUser.lastname,
    email: foundUser.email,
    age: foundUser.age,
    followers: foundUser.followers,
    following: foundUser.following,
    contactnum: foundUser.contactnum,
    self: isSelf,
  });
};

/// @GET /user/saved
/// Get the saved posts for a user
const getSavedPosts = async (req, res) => {
  const username = req.user;

  const foundUser = await UserModel.findOne(
    { username: username },
    { saved_posts: 1 }
  )
    .lean()
    .exec();

  // console.log(foundUser.saved_posts);
  const savedPosts = await Post.find({ id: { $in: foundUser.saved_posts } });
  // console.log(savedPosts);

  return res.status(200).send(savedPosts);
};

/// @GET /user/following
/// Get the usernames of the users followed by
/// the requesting user
const getFollowing = async (req, res) => {
  const username = req.user;

  const foundUser = await UserModel.findOne(
    { username: username },
    { following: 1 }
  )
    .lean()
    .exec();

  return res.status(httpstatuscodes.StatusCodes.OK).send(foundUser.following);
};

module.exports = {
  removeFollower,
  addFollowing,
  unFollow,
  editProfile,
  getProfile,
  getSavedPosts,
  getFollowing,
};
