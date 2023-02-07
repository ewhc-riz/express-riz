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
// const dataqueryBasePerson = require("./model.js");
const base_person_1 = require("../../../models/base-person");
function validate(data) {
    let errorMessage = "";
    if (data.first_name.trim() == "") {
        errorMessage = "First name is required";
    }
    else if (data.last_name.trim() == "") {
        errorMessage = "Last name is required";
    }
    else if (data.gender.trim() == "") {
        errorMessage = "Gender is required";
    }
    return errorMessage;
}
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(yield base_person_1.queryBasePerson.getAll(req.query));
}));
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let person = yield base_person_1.queryBasePerson.get(+req.params.id);
    res.send(person);
}));
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let errorMessage = validate(req.body);
    if (errorMessage == "") {
        yield base_person_1.queryBasePerson.insert(req.body);
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
    let errorMessage = validate(req.body);
    req.body.id = +req.params.id;
    if (errorMessage == "") {
        yield base_person_1.queryBasePerson.update(req.body);
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
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield base_person_1.queryBasePerson.delete(+req.params.id);
    res.send({
        status: 1,
        message: "Successful!",
    });
}));
module.exports = router;
//# sourceMappingURL=base-person.js.map