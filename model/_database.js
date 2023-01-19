"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const mysql_1 = __importDefault(require("mysql"));
const DATABASE_HOST = "127.0.0.1";
const DATABASE_PORT = "3306";
const DATABASE_USER = "root";
const DATABASE_PWD = "password";
const DATABASE_NAME = "local_sample_db";
exports.db = mysql_1.default.createConnection({
    host: DATABASE_HOST,
    port: +DATABASE_PORT,
    user: DATABASE_USER,
    password: DATABASE_PWD,
    database: DATABASE_NAME,
    insecureAuth: true,
    connectTimeout: 80000,
    charset: 'utf8mb4'
});
exports.db.connect((err, param) => {
    if (err) {
        console.error("MySQL Connection Failed: " + err.stack);
    }
    console.log("MySQL: Thread ID: " + exports.db.threadId);
    console.log("MySQL: Port: " + DATABASE_PORT);
    console.log("MySQL: Ready");
});
