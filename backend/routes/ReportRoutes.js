const express = require("express");
const router = express.Router();
const ReportController = require("../controllers/ReportController");
const reportLimiter = require("../middleware/ReportRateLimiter");
const verifyJWT = require("../middleware/VerifyJWT");

router.use(verifyJWT);

router
  .route("/")
  .post(reportLimiter, ReportController.createReport)
  .patch(ReportController.takeAction);

router.route("/:subgr").get(ReportController.getReports);

module.exports = router;
