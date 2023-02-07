"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const base_employee_1 = require("../../../models/base-employee");
function validate(data) {
    let errorMessage = "";
    if (data.person_id == "") {
        errorMessage = "Person is required";
    }
    else if (data.employee_no == "") {
        errorMessage = "Employee number is required";
    }
    return errorMessage;
}
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("base_employee");
    res.send(yield base_employee_1.queryBaseEmp.getAll(req.query));
}));
// router.get("/get-person", async (req, res) => {
//   console.log("base_person");
//   res.send(await queryBaseEmp.getPerson(req.query));
// });
router.get("/employeeinfo/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let employee = yield base_employee_1.queryBaseEmp.get(+req.params.id);
    res.send(employee);
}));
router.get("/get-employee-no", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let employee = yield base_employee_1.queryBaseEmp.getNewEmployeeNo();
    //console.log(employee.length);
    let employee_no = "";
    if (employee[0].employee_no == null) {
        employee_no = "EMP-00001";
    }
    else {
        console.log(employee);
        employee_no = "EMP-" + employee[0].employee_no.toString().padStart(5, "0");
    }
    res.send({ status: 1, employee_no: employee_no });
}));
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let errorMessage = validate(req.body);
    let ifEmployee = yield base_employee_1.queryBaseEmp.checkPersonIfEmployee(req.body.person_id);
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
            yield base_employee_1.queryBaseEmp.insert(req.body);
            res.send({
                status: 1,
                message: "Successful!",
            });
        }
    }
    else {
        res.send({
            status: 0,
            message: errorMessage,
        });
    }
}));
router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let errorMessage = validate(req.body);
    req.body.id = +req.params.id;
    if (errorMessage == "") {
        yield base_employee_1.queryBaseEmp.update(req.body);
        res.send({
            status: 1,
            message: "Successful!",
        });
    }
    else {
        res.send({
            status: 0,
            message: errorMessage,
        });
    }
}));
router.delete("/delete-employee/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield base_employee_1.queryBaseEmp.delete(+req.params.id);
    res.send({
        status: 1,
        message: "Successful!",
    });
}));
module.exports = router;
//# sourceMappingURL=base-employee.js.map