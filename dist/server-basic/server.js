"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// require("dotenv").config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
var fs = require("fs");
const PORT = process.env.PORT || 3000;
const app = (0, express_1.default)();
// app.use(express.json({ limit: "50mb" }));
app.use(express_1.default.urlencoded({
    extended: true,
}));
app.use((0, cors_1.default)());
app.use("/api", express_1.default.json({ limit: "50mb" }), require("./routes"));
app
    .listen(PORT, function () {
    console.log("Server is running on port:" + PORT);
})
    .addListener("close", () => {
    console.log("App closed.");
})
    .addListener("error", (err) => {
    console.log("App error: ", err);
});
//# sourceMappingURL=server.js.map