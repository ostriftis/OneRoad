const { Command } = require("commander");
const fetch = require("node-fetch");
const { healthCheck } = require("../../back-end/admin/healthCheck.js");


const healthcheck = new Command("healthcheck")
  .description("Check status of system")
  .action(async (options) => {
    try {
        const data = await healthCheck();
        console.log(JSON.stringify(data, null, 2)); // Pretty-print JSON
        process.exit(0);
    } catch (error) {
      console.error("Error fetching data:", error.message);
      process.exit(1);
    }
  });

module.exports = healthcheck;
