#!/usr/bin/env node
require("dotenv").config();
const { program } = require("commander");
const tollStationPasses = require("./commands/tollStationPasses.js");
const passAnalysis = require("./commands/passAnalysis.js");
const passesCost = require("./commands/passesCost.js");
const chargesBy = require("./commands/chargesBy.js");
const healthcheck = require("./commands/healthcheck.js")
const resetPasses = require("./commands/resetPasses.js");
const resetstations  = require("./commands/resetStations.js");
const login = require("./commands/login.js");
const logout = require("./commands/logout.js");
const admin = require("./commands/admin.js");


program
  .name("se2415")
  .description("CLI tool for toll station data analysis")
  .version("1.0.0");

program.addCommand(tollStationPasses);
program.addCommand(passAnalysis);
program.addCommand(passesCost);
program.addCommand(chargesBy);
program.addCommand(healthcheck);
program.addCommand(resetPasses);
program.addCommand(resetstations);
program.addCommand(login);
program.addCommand(logout);
program.addCommand(admin);

// Handle case where no arguments are provided
if (!process.argv.slice(2).length) {
  console.log("Available commands:");
  program.commands.forEach(cmd => {
    console.log(`\n${cmd.name()}:\n${cmd.helpInformation()}`);
  });
  process.exit(0);
}

// Parse command-line arguments
program.parse(process.argv);
