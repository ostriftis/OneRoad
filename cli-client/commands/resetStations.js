const { Command } = require("commander");
const fetch = require("node-fetch");
const { resetStations } = require("../../back-end/admin/resetStations.js");

const resetstations = new Command("resetstations")
  .description("Reset toll stations with default values")
  .action(async () => {
    try {
        const data = await resetStations();
        console.log(JSON.stringify(data, null, 2)); // Pretty-print JSON
        process.exit(0);
    } catch (error) {
      console.error("Error fetching data:", error.message);
      process.exit(1);
    }
  });

module.exports = resetstations;
