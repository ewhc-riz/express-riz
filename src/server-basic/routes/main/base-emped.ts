import express from "express";
const router = express.Router();
// const dataqueryBaseEmpEd = require("./model.js");
import { queryBaseEmpEd } from "../../../models/base-emped";

function validate(data) {
  let errorMessage = "";
  if (data.employee_no == "") {
    errorMessage = "Education Level is required";
  }  else if (data.level == "") {
    errorMessage = "Employee number is required";
  return errorMessage;
  }
}

router.get("/", async (req, res) => {
  res.send(await queryBaseEmpEd.getAll(req.query));
});

router.get("/:id", async (req, res) => {
  let person = await queryBaseEmpEd.get(+req.params.id);
  res.send(person);
});

router.post("/", async (req, res) => {
  let errorMessage = validate(req.body);

  if (errorMessage == "") {
    await queryBaseEmpEd.insert(req.body);
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
    await queryBaseEmpEd.update(req.body);
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
  await queryBaseEmpEd.delete(+req.params.id);
  res.send({
    status: 1,
    message: "Successful!",
  });
});

module.exports = router;
