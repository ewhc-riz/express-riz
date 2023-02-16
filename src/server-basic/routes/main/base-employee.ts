import express from "express";
const router = express.Router();
import { queryBaseEmployee } from "../../../models/base-employee";
import { queryBasePerson } from "../../../models/base-person";
import moment from "moment";

function validate(data) {
  let errorMessage = "";

  if (data.last_name == "") {
    errorMessage = "Lastname is required";
  } else if (data.first_name == "") {
    errorMessage = "Firstname is required";
  } else if (data.gender == "") {
    errorMessage = "Gender is required";
  } else if (data.date_of_birth == "") {
    errorMessage = "Birthday is required";
  } else if (data.date_hired == "") {
    errorMessage = "Date Hired is required";
  } else if (!moment(data.date_hired).isValid()) {
    errorMessage = "Date Hired is invalid";
  }

  return errorMessage;
}

router.get("/", async (req, res) => {
  res.send(await queryBaseEmployee.getAll(req.query));
});

router.get("/:id", async (req, res) => {
  let employee = await queryBaseEmployee.get(+req.params.id);
  res.send(employee);
});

router.post("/get-employee-no", async (req, res) => {
  let employee = await queryBaseEmployee.getNewEmployeeNo();

  let employee_no = "";
  if (employee[0].employee_no == null) {
    employee_no = "EMP-00001";
  } else {
    //   console.log(employee);
    employee_no = "EMP-" + employee[0].employee_no.toString().padStart(5, "0");
  }

  res.send({ status: 1, employee_no: employee_no });
});

router.post("/", async (req, res) => {
  let errorMessage = validate(req.body);
  if (errorMessage == "") {
    // console.log(req.body);
    //must have insert person
    req.body.citizen = req.body.citizen == "on" ? 1 : 0;
    req.body.date_of_birth = moment(req.body.date_of_birth).format(
      "YYYY-MM-DD"
    );

    // insert person first
    let result0 = await queryBasePerson.insert(req.body);
    req.body.person_id = result0.insertId;

    // insert employee
    let result = await queryBaseEmployee.insert(req.body);

    for (let educ of req.body.employee_educations) {
      if (+educ.for_deletion == 0) {
        educ.employee_id = result.insertId;
        queryBaseEmployee.insertEducation(educ);
      }
    }
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
  console.log("Employee Data: ", req.body);
  if (errorMessage == "") {
    /* START UPDATE EMPLOYEE INFO - base_person*/
    req.body.citizen = req.body.citizen == "on" ? 1 : 0;
    req.body.date_of_birth = moment(req.body.date_of_birth).format(
      "YYYY-MM-DD"
    );

    await queryBasePerson.update(req.body);
    /* END UPDATE EMPLOYEE INFO - base_person*/

    /*START Update employee Info base_employee */
    req.body.date_hired = moment(req.body.date_hired).format("YYYY-MM-DD");
    await queryBaseEmployee.update(req.body);
    /*END update employee info base_employee */

    /* START UPDATE / INSERT EMPLOYEE EDUCATION */
    for (let educ of req.body.employee_educations) {
      if (educ.id == 0) {
        educ.employee_id = +req.params.id;
        await queryBaseEmployee.insertEducation(educ);
      } else {
        await queryBaseEmployee.updateEducation(educ);
      }
    }
    /* END UPDATE / INSERT EMPLOYEE EDUCATION */

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

router.delete("/delete-employee/:id", async (req, res) => {
  await queryBaseEmployee.delete(+req.params.id);
  res.send({
    status: 1,
    message: "Successful!",
  });
});

module.exports = router;
