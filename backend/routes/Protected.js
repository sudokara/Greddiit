const express = require("express");
const verifyJWT = require("../middleware/VerifyJWT");
const router = express.Router();
const AuthController = require("../controllers/AuthController");

router.use(verifyJWT);

router.route("/").get(AuthController.logout);

module.exports = router