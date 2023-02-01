import express from "express";
const router = express.Router();
import { queryBaseUser } from "../../../models/base-user";

function validate(data) {
  let errorMessage = "";
  if (data.person_id == "") {
    errorMessage = "Person is required";
  } else if (data.employee_no == "") {
    errorMessage = "Employee number is required";
  }
  return errorMessage;
}

router.get("/", async (req, res) => {
  res.send(await queryBaseUser.getAll(req.query));
});

router.get("/:id", async (req, res) => {
  let employee = await queryBaseUser.get(+req.params.id);
  res.send(employee);
});

router.get("/getperson", async (req, res) => {
  res.send(await queryBaseUser.getPerson(req.query));
});

router.post("/", async (req, res) => {
  let errorMessage = validate(req.body);

  if (errorMessage == "") {
    await queryBaseUser.insert(req.body);
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
    await queryBaseUser.update(req.body);
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
  await queryBaseUser.delete(+req.params.id);
  res.send({
    status: 1,
    message: "Successful!",
  });
});

module.exports = router;
