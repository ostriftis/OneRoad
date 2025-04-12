const { Command } = require("commander");
const bcrypt = require("bcrypt");
const fs = require("fs").promises;
const path = require("path");
const os = require("os");
const fetch = require("node-fetch");
const jwt = require("jsonwebtoken"); // Added for decoding JWT token
const getAccessLevelFromToken = require("./authentication");
const { registerUser, getUsers, checkRecordExists, updateUserPassword, insertPasses } = require("../../back-end/db/mySqlFuncs");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const port = process.env.PORT;
const host = process.env.HOST;

const AUTH_FILE = path.join(os.homedir(), ".se2415_auth");


const admin = new Command("admin")
  .description("Admin actions: user management, add passes, list users")
  .option("--usermod", "Create a new user or modify password")
  .option("--username <username>", "Username of the user to create/modify \n(obligatory subparameter for --usermod option)")
  .option("--passw <password>", "Password of the user \n(obligatory subparameter for --usermod option)")
  .option("--accesslvl <accesslevel>", "Level of access for the new user \n(optional subparameter for --usermod option)", "tollCompany")
  .option("--users", "Display list of users")
  .option("--addpasses", "Add new passes from CSV file")
  .option("--source <filename>", "Source CSV file with passes")
  .action(async (options) => {
    try {
      // Check authentication (read auth token and extract access level)
      const accessLevel = await getAccessLevelFromToken();

        if (accessLevel !== 'admin') {
            console.log("Error: You must have 'admin' access level to perform this action.");
            process.exit(1);
        }

        if (options.usermod) {
            // User modification (create or modify user)
            if (!options.username || !options.passw) {
            console.error("Error: --username and --passw are required for usermod.");
            process.exit(1);
            }
            const user = await checkRecordExists("users", "username", options.username);

            if (user) {
            // User exists, update the password
            await updateUserPassword(options.username, options.passw);
            } else {
            console.log("User not found, creating new user...");
            // If user doesn't exist, register a new user
            await registerUser(options.username, options.passw, options.accesslvl);
            }
        }

        else if (options.users) {
            const users = await getUsers(); // Fetch users from the database

            if (users.length === 0) {
                console.log("No users found.");
            } else {
                console.log("List of users:");
                users.forEach((user) => {
                    console.log(user.username);
                });
            }
        }

        else if (options.addpasses) {
        // Add passes from CSV file
            if (!options.source) {
              console.error("Error: --source (CSV file) is required for adding passes.");
              process.exit(1);
            }  
            const passesFile = options.source;
            await insertPasses(passesFile);  // Insert passes using the insertPasses function
        }
        process.exit(0);
    } catch (error) {
      console.error("Admin action failed:", error.message);
      process.exit(1);
    }
  });

module.exports = admin;
