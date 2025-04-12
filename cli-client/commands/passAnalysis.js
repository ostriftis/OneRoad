const { Command } = require("commander");
const fetch = require("node-fetch");
require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });

const port = process.env.PORT;
const host = process.env.HOST;


const passAnalysis = new Command("passanalysis")
  .description("Pass analysis between two Operators")
  .option("--stationop <op1>", "Station Operator ID")
  .option("--tagop <op2>", "Tag Operator ID")
  .option("--from <YYYYMMDD>", "Start date")
  .option("--to <YYYYMMDD>", "End date")
  .option("--format <json|csv>", "Output format", "csv")  // Default to CSV
  .action(async (options) => {
    const { stationop, tagop, from, to, format } = options;
    try {
      const apiUrl = `http://${host}:${port}/api/passAnalysis/${stationop}/${tagop}/${from}/${to}?format=${format}`;

      if(!stationop && !from && !to && !tagop) {
        passAnalysis.help();
        process.exit(0);
      }
      else if (!stationop || !from || !to || !tagop) {
        console.log("Error: Missing required parameters.");
        passAnalysis.help();
        process.exit(0);
      }
      /*from date bigger than to date*/ 
      if(from > to) {
        console.log("Error: The '--from' date must be before the '--to' date.");
        process.exit(1);
      }
      if(format!=='csv' && format !== 'json'){
        console.log("Error: Invalid format, format must be 'csv' or 'json'");
        process.exit(1);
      }
      else {
        /*Trying to fetch the data*/
        //console.log(`Fetching data from: ${apiUrl}`);
        const response = await fetch(apiUrl, { method: "GET" });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        // Handle the response based on the format
        if (format === 'csv') {
          const csv = await response.text();
          console.log(csv);
        } else {
          const data = await response.json();
          console.log(JSON.stringify(data, null, 2)); // Pretty-print JSON
        }
        process.exit(0);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
      process.exit(1);
    }
  });

module.exports = passAnalysis;
