const { Command } = require("commander");
const fetch = require("node-fetch");
require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });

const port = process.env.PORT;
const host = process.env.HOST;


const passesCost = new Command("passescost")
  .description("Cost of passes between two Operators")
  .option("--stationop <op1>", "Station Operator ID")
  .option("--tagop <op2>", "Tag Operator ID")
  .option("--from <YYYYMMDD>", "Start date")
  .option("--to <YYYYMMDD>", "End date")
  .option("--format <json|csv>", "Output format", "csv")  // Default to CSV
  .action(async (options) => {
    const { stationop, tagop, from, to, format} = options;
    try {

      if(!stationop && !from && !to && !tagop) {
        passesCost.help();
        process.exit(1);
      }
      else if (!stationop || !from || !to || !tagop) {
        console.log("Error: Missing required parameters.");
        passesCost.help();
        process.exit(1);
      }

      const apiUrl = `http://${host}:${port}/api/passesCost/${stationop}/${tagop}/${from}/${to}?format=${format}`;

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
        const csv = await response.text();
        console.log(csv);
      }
      process.exit(0);
    } catch (error) {
      console.error("Error fetching data:", error.message);
      process.exit(1);
    }
  });

module.exports = passesCost;
