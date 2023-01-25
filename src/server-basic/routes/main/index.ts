import express from "express";
const router = express.Router();

router.use("/base-persons", require("./base-person"));

module.exports = router;
