import promise from "bluebird"
// var promise = require("bluebird")

var options = {
  // Initialization Options
  promiseLib: promise,
}

import pgPromise from "pg-promise"
var pgp = pgPromise(options)

const connectionString = "postgres://postgres:postgres@localhost:5432/cbr"
let ssl = { rejectUnauthorized: false }
const config = {
  connectionString,
//   ssl,
}
var db = pgp(config)
export default db
