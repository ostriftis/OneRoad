const { Command } = require("commander");
const fetch = require("node-fetch");
const { resetPasses} = require("../../back-end/admin/resetPasses.js");

const resetpasses = new Command("resetpasses")
  .description("Reset and initialize passes. Reset admin credentials")
  .action(async () => {
    try {
        const data = await resetPasses();
        console.log(JSON.stringify(data, null, 2)); // Pretty-print JSON
        process.exit(0);
    } catch (error) {
      console.error("Error fetching data:", error.message);
      process.exit(1);
    }
  });

module.exports = resetpasses;
