const { truncate, resetAdmin, addPasses } = require("../db/mySqlFuncs.js");

const resetPasses = async () => {
  try {
    await truncate('passes');
    await truncate('driver');
    await resetAdmin();

    // Return a JSON object instead of sending a response
    return { status: "OK" };
  } catch (err) {
    return {
      status: "failed",
      info: err.message || "An error occurred while resetting passes",
    };
  }
};

  module.exports = { resetPasses };