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
// const dataqueryBaseEmpEd = require("./model.js");
const base_emped_1 = require("../../../models/base-emped");
function validate(data) {
    return __awaiter(this, void 0, void 0, function* () {
        let ifEducationExists = yield base_emped_1.queryBaseEmpEd.checkEducationIfExists(data.employee_id, data.level);
        let errorMessage = "";
        return new Promise((resolve, reject) => {
            if (data.level == "") {
                errorMessage += "Education Level is required <br>";
            }
            if (data.employee_id == "") {
                errorMessage += "PLease select Employee <br>";
            }
            if (data.school_name == "") {
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
        });
    });
}
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(yield base_emped_1.queryBaseEmpEd.getAll(req.query));
}));
router.get("/person-employee", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(yield base_emped_1.queryBaseEmpEd.getAll(req.query));
}));
router.get("/get-education/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Params Id: ', req.params.id);
    let employeeEducation = yield base_emped_1.queryBaseEmpEd.getEducation(+req.params.id);
    //console.log(employeeEducation);
    res.send(employeeEducation);
}));
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let errorMessage = yield validate(req.body);
    console.log(req.body);
    if (errorMessage == "") {
        yield base_emped_1.queryBaseEmpEd.insert(req.body);
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
router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let errorMessage = yield validate(req.body);
    req.body.id = +req.params.id;
    if (errorMessage == "") {
        yield base_emped_1.queryBaseEmpEd.update(req.body);
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
router.delete("/delete/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield base_emped_1.queryBaseEmpEd.delete(+req.params.id);
    console.log('Delete: ', req.params.id);
    res.send({
        status: 1,
        message: "Successful!",
    });
}));
module.exports = router;
//# sourceMappingURL=base-emped.js.map