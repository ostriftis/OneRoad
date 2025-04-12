const { Command } = require("commander");
const fetch = require("node-fetch");
require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });

const port = process.env.PORT;
const host = process.env.HOST;


const chargesBy = new Command("chargesby")
  .description("Passes from vehicles of other Operators")
  .option("--opid <op>", "toll Operator ID")
  .option("--from <YYYYMMDD>", "Start date")
  .option("--to <YYYYMMDD>", "End date")
  .option("--format <json|csv>", "Output format", "csv")  // Default to CSV
  .action(async (options) => {
    const { opid, from, to, format} = options;
    try {
      if(!opid && !from && !to) {
        chargesBy.help();
        process.exit(1);
      }
      else if (!opid || !from || !to) {
        console.log("Error: Missing required parameters.");
        chargesBy.help();
        process.exit(1);
      }


      const apiUrl = `http://${host}:${port}/api/chargesBy/${opid}/${from}/${to}?format=${format}`;

      /*from date bigger than to date*/ 
      if(from > to) {
        console.log("Error: The '--from' date must be before the '--to' date.");
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

        const csv = await response.text();
        console.log(csv);
      }
      process.exit(0);
    } catch (error) {
      console.error("Error fetching data:", error.message);
      process.exit(1);
    }
  });

module.exports = chargesBy;
