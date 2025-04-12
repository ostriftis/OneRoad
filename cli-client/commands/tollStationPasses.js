const { Command } = require("commander");
const fetch = require("node-fetch");
require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });

const port = process.env.PORT;
const host = process.env.HOST;


const tollStationPasses = new Command("tollstationpasses")
  .description("Retrieve toll station pass data")
  .option("--station <stationID>", "Toll station ID")
  .option("--from <YYYYMMDD>", "Start date")
  .option("--to <YYYYMMDD>", "End date")
  .option("--format <json|csv>", "Output format", "csv")  // Default to CSV
  .action(async (options) => {
    const { station, from, to, format } = options;
    try {
      if(!station && !from && !to) {
        tollStationPasses.help();
        process.exit(1);
      }
      else if (!station || !from || !to) {
        console.log("Error: Missing required parameters.");
        tollStationPasses.help();
        process.exit(1);
      }

      const apiUrl = `http://${host}:${port}/api/tollStationPasses/${station}/${from}/${to}?format=${format}`;

      /*from date bigger than to date*/ 
      if(from > to) {
        console.log("Error: The '--from' date must be before the '--to' date.");
        process.exit(1);
      }
      if(format !=='csv' && format !== 'json'){
        console.log("Error: Ivalid format, format must be 'csv' or 'json'");
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
        } else if (format === 'json'){
          const data = await response.json();
          console.log(JSON.stringify(data, null, 2)); // Pretty-print JSON
        }
        else {
          console.log("Error: format not supported.(supported formats csv, json)")
        }
        
      }
      process.exit(0);
    } catch (error) {
      console.error("Error fetching data:", error.message);
      process.exit(1);
    }
  });

module.exports = tollStationPasses;
