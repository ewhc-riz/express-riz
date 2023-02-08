import express from "express";
const router = express.Router();
import { queryBaseEmp } from "../../../models/base-employee";

function validate(data) {
  let errorMessage = "";

  if (data.last_name == "") {
    // errorMessage = "Person is required";
    errorMessage += "Lastname is required <br>";

  }
  if (data.first_name == "") {
    // errorMessage = "Person is required";
    errorMessage += "Firstname is required <br>";

  }
  if (data.gender == "") {
    // errorMessage = "Person is required";
    errorMessage += "Gender is required <br>";
  }
  if (data.date_of_birth == "") {
    // errorMessage = "Person is required";
    errorMessage += "Birthday is required <br>";
  }


  return errorMessage;
}

router.get("/", async (req, res) => {
  //  console.log("base_employee");
  res.send(await queryBaseEmp.getAll(req.query));
});


router.get("/:id", async (req, res) => {
  let data = {
    employeeId: req.params.id
  };
  let employeeInfo = await queryBaseEmp.getAll(data);
  
  let employeeEducation = await queryBaseEmp.getEmployeeEducation(req.params.id);
  
  

  res.send( {
    employee : employeeInfo,
    education : employeeEducation
  });
});

router.post("/get-employee-no", async (req, res) => {
  let employee = await queryBaseEmp.getNewEmployeeNo();

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
  let ifEmployee = await queryBaseEmp.checkPersonIfEmployee(req.body.person_id);

  console.log('IfEmployee: ', ifEmployee)
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
  console.log(req.body.employee_educations);
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
