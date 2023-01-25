import express from "express";
const router = express.Router();

router.use("/main", require("./main"));

module.exports = router;
