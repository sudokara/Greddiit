const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");
const verifyJWT = require("../middleware/VerifyJWT");

router.use(verifyJWT);

router.route("/removefollower").post(userController.removeFollower);

router.route("/addfollowing").post(userController.addFollowing);

router.route("/unfollow").post(userController.unFollow);

router.route("/edit").patch(userController.editProfile);

router.route("/saved").get(userController.getSavedPosts);

router.route("/following").get(userController.getFollowing);

router.route("/:username").get(userController.getProfile);

module.exports = router;
