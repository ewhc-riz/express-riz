import express from "express";
const router = express.Router();
import { queryBaseEmp } from "../../../models/base-employee";

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
  console.log("base_employee");
  res.send(await queryBaseEmp.getAll(req.query));
});

// router.get("/get-person", async (req, res) => {
//   console.log("base_person");
//   res.send(await queryBaseEmp.getPerson(req.query));
// });

router.get("/employeeinfo/:id", async (req, res) => {
  let employee = await queryBaseEmp.get(+req.params.id);
  res.send(employee);
});

router.get("/get-employee-no", async (req, res) => {
  let employee = await queryBaseEmp.getNewEmployeeNo();

  //console.log(employee.length);
  let employee_no = "";
  if (employee[0].employee_no == null) {
    employee_no = "EMP-00001";
  } else {
    console.log(employee);
    employee_no = "EMP-" + employee[0].employee_no.toString().padStart(5, "0");
  }

  res.send({ status: 1, employee_no: employee_no });
});

router.post("/", async (req, res) => {
  let errorMessage = validate(req.body);
  let ifEmployee = await queryBaseEmp.checkPersonIfEmployee(req.body.person_id);

  if (errorMessage == "") {
    if (ifEmployee.length > 0) {
      errorMessage = "Person Already an Employee";
      res.send({
        status: 0,
        message: errorMessage,
      });
    }
    else {
      console.log(req.body);
      await queryBaseEmp.insert(req.body);
      res.send({
        status: 1,
        message: "Successful!",
      });
  
    }

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
    await queryBaseEmp.update(req.body);
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
  await queryBaseEmp.delete(+req.params.id);
  res.send({
    status: 1,
    message: "Successful!",
  });
});

module.exports = router;
