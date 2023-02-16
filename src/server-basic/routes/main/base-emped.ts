import express from "express";
const router = express.Router();
// const dataqueryBaseEmpEd = require("./model.js");
import { queryBaseEmployeeEducation } from "../../../models/base-emped";

async function validate(data) {
  let ifEducationExists = await queryBaseEmployeeEducation.checkEducationIfExists(data.employee_id, data.level);
  let errorMessage = "";
 
return new Promise((resolve, reject) => {
  if (data.level == "") {
    errorMessage += "Education Level is required <br>";
  } 
  if (data.employee_id == "") {
    errorMessage += "PLease select Employee <br>";
  } 
  if (data.school_name  == "") {
    errorMessage += "School Name is required <br>";
  } 
  if (data.year_graduated == "") {
    errorMessage += "Year Graduated is required <br>";
  } 
  console.log(ifEducationExists);
   if (ifEducationExists && +data.id == 0) {
    errorMessage += "Education Level already exists for Employee <br>";
  }

  return resolve(errorMessage);

})
  
}

router.get("/", async (req, res) => {
  res.send(await queryBaseEmployeeEducation.getAll(req.query));
});

router.get("/person-employee", async (req, res) => {

  res.send(await queryBaseEmployeeEducation.getAll(req.query));
});

router.get("/get-education/:id", async (req, res) => {

  console.log('Params Id: ', req.params.id);
  let employeeEducation = await queryBaseEmployeeEducation.getEducation(+req.params.id);
  //console.log(employeeEducation);
  res.send(employeeEducation);
});

router.post("/", async (req, res) => {
  let errorMessage = await validate(req.body);
  console.log(req.body);
  if (errorMessage == "") {
    await queryBaseEmployeeEducation.insert(req.body);
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
  let errorMessage = await validate(req.body);

  req.body.id = +req.params.id;

  if (errorMessage == "") {
    await queryBaseEmployeeEducation.update(req.body);
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

router.delete("/delete/:id", async (req, res) => {
  await queryBaseEmployeeEducation.delete(+req.params.id);
  console.log('Delete: ', req.params.id)
  res.send({
    status: 1,
    message: "Successful!",
  });
});

module.exports = router;
