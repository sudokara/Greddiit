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

router.route("/mysubs").get(SubGreddiitController.mySubgreddiits);

router.route("/all").get(SubGreddiitController.getAllSubs);

router.route("/leave/:subgr").get(SubGreddiitController.leaveSubgreddiit);

router.route("/delete/:subgr").delete(SubGreddiitController.deleteSubgreddiit);

module.exports = router;
