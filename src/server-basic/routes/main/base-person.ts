import express from "express";
const router = express.Router();
// const dataqueryBasePerson = require("./model.js");
import { queryBasePerson } from "../../../models/base-person";

function validate(data) {
  let errorMessage = "";
  if (data.first_name.trim() == "") {
    errorMessage = "First name is required";
  } else if (data.last_name.trim() == "") {
    errorMessage = "Last name is required";
  } else if (data.gender.trim() == "") {
    errorMessage = "Gender is required";
  }
  return errorMessage;
}

router.get("/", async (req, res) => {
  res.send(await queryBasePerson.getAll(req.query));
});

router.get("/:id", async (req, res) => {
  let person = await queryBasePerson.get(+req.params.id);
  res.send(person);
});

router.post("/", async (req, res) => {
  let errorMessage = validate(req.body);

  if (errorMessage == "") {
    await queryBasePerson.insert(req.body);
    res.send({
      status: 1,
      message: "Successful!",
    });
  } else {
    res.send({
      status: 0,
      message: errorMessage,
    });
  }
});

router.put("/:id", async (req, res) => {
  let errorMessage = validate(req.body);

  req.body.id = +req.params.id;

  if (errorMessage == "") {
    await queryBasePerson.update(req.body);
    res.send({
      status: 1,
      message: "Successful!",
    });
  } else {
    res.send({
      status: 0,
      message: errorMessage,
    });
  }
});

router.delete("/:id", async (req, res) => {
  await queryBasePerson.delete(+req.params.id);
  res.send({
    status: 1,
    message: "Successful!",
  });
});

module.exports = router;
