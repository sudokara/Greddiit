const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/AuthController");
const loginLimiter = require("../middleware/RateLimiter");

router.route("/").post(loginLimiter, AuthController.login);

router.route("/refresh").get(AuthController.refresh);

router.route("/register").post(loginLimiter, AuthController.register);

router.route("/check").get(AuthController.checkAuth);

router.route("/logout").post(AuthController.logout);

module.exports = router;
