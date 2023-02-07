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
const base_user_1 = require("../../../models/base-user");
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
    res.send(yield base_user_1.queryBaseUser.getAll(req.query));
}));
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let employee = yield base_user_1.queryBaseUser.get(+req.params.id);
    res.send(employee);
}));
router.get("/getperson", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(yield base_user_1.queryBaseUser.getPerson(req.query));
}));
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let errorMessage = validate(req.body);
    if (errorMessage == "") {
        yield base_user_1.queryBaseUser.insert(req.body);
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
        yield base_user_1.queryBaseUser.update(req.body);
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
    yield base_user_1.queryBaseUser.delete(+req.params.id);
    res.send({
        status: 1,
        message: "Successful!",
    });
}));
module.exports = router;
//# sourceMappingURL=base-user.js.map