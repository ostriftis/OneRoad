const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); 

const { insertPasses } = require("../db/mySqlFuncs");

async function addPasses(req, res) {
  try {
    if (!req.file) {
      console.log("No file uploaded"); // 
      return res.status(400).json({ 
        status: "failed", 
        info: "No file uploaded" 
      });
    }

    console.log("File uploaded to:", req.file.path); 
    await insertPasses(req.file.path); 

    res.status(200).json({ status: "OK" });
  } catch (err) {
    console.error("Error in addPasses:", err); // Critical for debugging
    res.status(500).json({ // Use 500 for server-side errors
      status: "failed",
      info: err.message || "Internal server error",
    });
  }
}

module.exports = { addPasses };