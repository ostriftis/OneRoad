const dotenv = require("dotenv");
const mysql = require("mysql2/promise");
dotenv.config();

const config = {
    host: 'localhost',
    user: 'softEng',
    password: 'mathima',
    database: 'softEng',
  };



// Create a connection to the database
const db = mysql.createPool(config);


//make a simple query to test connection
const testDB = async () => {
  try {
    await db.query("SELECT 1");
    console.log("Connected to MySQL database");
  } catch (error) {
    console.error("Database connection failed:", error.stack);
    process.exit(1);
  }
};


  module.exports = {
    config,
    db,
    testDB
  };