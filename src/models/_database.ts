const mysql = require("mysql");
require('dotenv').config();

export let db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PWD,
  database: process.env.DATABASE_NAME,
  insecureAuth: true,
  connectTimeout: 80000,
  charset : 'utf8mb4'
});

db.connect((err: any, param : any) => {
  if (err) {
    console.error("MySQL Connection Failed: " + err.stack);
  }
  console.log("MySQL: Thread ID: " + db.threadId);
  console.log("MySQL: Port: " + process.env.DATABASE_PORT);
  console.log("MySQL: Ready");
});


