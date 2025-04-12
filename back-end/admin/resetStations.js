const { truncate, initStations } = require("../db/mySqlFuncs.js")

const resetStations = async () => {
  try {
    await truncate('tollStations');  // Clear the stations table
    await initStations();  // Reinitialize stations from CSV

    return { status: "OK" };
  } catch (err) {
    return {
      status: "failed",
      info: err.message || "An error occurred while resetting stations",
    };
  }
};

  module.exports = { resetStations };