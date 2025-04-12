const { config, db } = require("../db/dbConfig.js");
const { countDistinct, countTotal } = require("../db/mySqlFuncs.js")


const healthCheck = async () => {
  try {
    const connectionString = `mysql://${config.user}:${config.password}@${config.host}/${config.database}`;

    await db.query("SELECT 1");

    const n_stations = await countDistinct('tollStations', 'tollId');
    const n_tags = await countDistinct('passes', 'tagRef');
    const n_passes = await countTotal('passes');

    // Return health check status
    return {
      status: "OK",
      dbconnection: connectionString,
      n_stations: n_stations,
      n_tags: n_tags,
      n_passes: n_passes
    };
  } catch (error) {
    console.error("Error during healthcheck:", error);

    // Return error status
    return {
      status: "failed",
      dbconnection: `mysql://${config.user}:${config.password}@${config.host}/${config.database}`,
      error: error.message,
    };
  }
};

module.exports = { healthCheck };
