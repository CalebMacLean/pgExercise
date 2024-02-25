/** Database setup for BizTime. */
const { Client } = require("pg");
require("dotenv").config();

let DB_URI;
let user = process.env.DB_USER;
let password = process.env.DB_PASSWORD;
// console.log("user", user);
// console.log("password", password);
// console.log("process.env", process.env);

if (process.env.NODE_ENV === "test") {
  DB_URI = `postgresql://${user}:${password}@localhost/biztime_test`;
  // console.log(DB_URI);
} else {
  DB_URI = `postgresql://${user}:${password}@localhost/biztime`;
  // console.log(DB_URI);
}

let db = new Client({
  connectionString: DB_URI
});
db.connect();

module.exports = db;