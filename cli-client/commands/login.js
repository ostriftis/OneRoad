const { Command } = require("commander");
const fs = require("fs").promises;
const path = require("path");
const os = require("os");
const fetch = require("node-fetch");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const port = process.env.PORT;
const host = process.env.HOST;

const AUTH_FILE = path.join(os.homedir(), ".se2415_auth");
const API_URL = `http://${host}:${port}/api/login`; 

const login = new Command("login")
  .description("Authenticate a user with username and password")
  .option("--username <username>", "User's username")
  .option("--passw <password>", "User's password")
  .action(async (options) => {
    const { username, passw: password } = options;

    if (!username || !password) {
      console.error("Error: Both --username and --passw are required.");
      process.exit(1);
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password}),
      });

      const responseData = await response.json(); // Parse response once

      if (!response.ok) {
        throw new Error(responseData.error || "Login failed");
      }

      const { token } = responseData;

      // Store token asynchronously
      await fs.writeFile(AUTH_FILE, JSON.stringify({ username, token}), { mode: 0o600 });

      console.log("Login successful!");
      process.exit(0);
    } catch (error) {
      console.error("Login failed:", error.message);
      process.exit(1);
    }
  });

module.exports = login;
