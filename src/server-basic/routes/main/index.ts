import express from "express";
const router = express.Router();

router.use("/base-persons", require("./base-person"));
router.use("/base-employees", require("./base-employee"));
router.use("/base-employees-education", require("./base-emped"));
router.use("/base-users", require("./base-user"));

module.exports = router;
