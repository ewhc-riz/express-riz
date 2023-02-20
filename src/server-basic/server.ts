// require("dotenv").config();
import express from "express";
import cors from "cors";
var fs = require("fs");
import env from "dotenv";


const PORT = process.env.PORT || 3000;
const app = express();

// app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cors());
app.use("/api", express.json({ limit: "50mb" }), require("./routes"));
app
  .listen(PORT, function () {
    console.log("Server is running on port:" + PORT);
  })
  .addListener("close", () => {
    console.log("App closed.");
  })
  .addListener("error", (err) => {
    console.log("App error: ", err);
  });
