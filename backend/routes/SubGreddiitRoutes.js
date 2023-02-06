const express = require("express");
const router = express.Router();
const SubGreddiitController = require("../controllers/SubGreddiitController");
const verifyJWT = require("../middleware/VerifyJWT");

router.use(verifyJWT);

router.route("/create").post(SubGreddiitController.createSubgreddiit);

router.route("/info/:subgr").get(SubGreddiitController.getSubInfo);

router.route("/users/:subgr").get(SubGreddiitController.getSubUsers);

router
  .route("/jreq/:subgr")
  .get(SubGreddiitController.getJoinRequests)
  .patch(SubGreddiitController.patchJoinRequests)
  .post(SubGreddiitController.addJoinRequest);

router.route("/ismod/:subgr").get(SubGreddiitController.isSubMod);

router.route("/leave/:subgr").post(SubGreddiitController.leaveSubgreddiit);

router.route("/delete/:subgr").delete(SubGreddiitController.deleteSubgreddiit);

module.exports = router;
