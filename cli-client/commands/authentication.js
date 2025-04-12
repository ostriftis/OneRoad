const fs = require('fs').promises;  // Use fs.promises API for async file I/O
const jwt = require('jsonwebtoken');
const path = require('path');
const os = require('os');
require('dotenv').config();

const AUTH_FILE = path.join(os.homedir(), '.se2415_auth');

// Asynchronous function to decode the token and extract access level
async function getAccessLevelFromToken() {
  try {
    // Use fs.promises.readFile for non-blocking file read
    const authData = await fs.readFile(AUTH_FILE, 'utf8');
    const { token } = JSON.parse(authData); // Parse file content
    const decoded = jwt.decode(token); // Decode the JWT token
    if (decoded && decoded.access_level) {
      return decoded.access_level;
    } else {
      throw new Error('Access level not found in token');
    }
  } catch (error) {
    return null;
  }
}

module.exports = getAccessLevelFromToken;