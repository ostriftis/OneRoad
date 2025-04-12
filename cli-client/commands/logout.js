const { Command } = require("commander");
const fs = require("fs").promises;
const path = require("path");
const os = require("os");
const fetch = require("node-fetch");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const port = process.env.PORT;
const host = process.env.HOST;

const AUTH_FILE = path.join(os.homedir(), ".se2415_auth");
const API_URL = `http://${host}:${port}/api/logout`;

const logout = new Command("logout")
  .description("Log out the current user")
  .action(async () => {
    try {
      // Check if auth file exists
      await fs.access(AUTH_FILE);

      // Read the auth file asynchronously
      const authData = JSON.parse(await fs.readFile(AUTH_FILE, "utf-8"));
      const token = authData.token;

      // Send logout request
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const responseData = await response.json(); // Parse response once

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to log out");
      }

      // Remove local token file asynchronously
      await fs.unlink(AUTH_FILE);
      console.log("Logged out successfully.");
      process.exit(0);
    } catch (error) {
      if (error.code === "ENOENT") {
        console.log("No user is currently logged in.");
        return;
      }
      console.error("Logout failed:", error.message);
      process.exit(1);
    }
  });

module.exports = logout;
