const fs = require("fs");
const { db } = require("./dbConfig");
const path = require("path");
const bcrypt = require("bcrypt")

const checkRecordExists = async (tableName, column, value) => {
  try {
    const query = `SELECT * FROM ${tableName} WHERE ${column} = ?`;
    const [results] = await db.query(query, [value]); 
    return results.length ? results[0] : null;
  } catch (err) {
    throw err;
  }
};

async function registerUser(username, password, access_level) {
  try {
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert the user into the database
    const insertQuery = `
      INSERT INTO users (username, password, access_level)
      VALUES (?, ?, ?)
    `;

    const [result] = await db.execute(insertQuery, [username, hashedPassword, access_level]);

    console.log("User registered successfully with userId:", result.insertId);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}


const truncate = async (tableName) => {
  try {
    const foreignKeysDisable = `SET FOREIGN_KEY_CHECKS = 0`;
    await db.query(foreignKeysDisable);
    const deleteQuery = `DELETE FROM ${tableName}`;
    await db.query(deleteQuery); 
    const foreignKeysEnable = `SET FOREIGN_KEY_CHECKS = 1`;
    await db.query(foreignKeysEnable);
    console.log('Data deleted succesfully');
  } catch (err) {
    throw new Error(`Failed to delete from table: ${err.message}`);
  }
};

const initStations = async () => {
  try {
    const filePath = path.join(__dirname, 'tollstations2024.csv');
    const data = fs.readFileSync(filePath, 'utf8'); // Read file content
    
    const rows = data.split('\n').slice(1); // Skip header row
    
    for (const row of rows) {
      const values = row.split(',').map(value => value.trim().replace(/"/g, ''));
      
      const query = `
        INSERT INTO tollStations (opId, operator, tollId, name, pm, locality, road, lat, longitude, email, price1, price2, price3, price4)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      await db.query(query, values);
    }
    
    console.log('CSV data inserted successfully!');
  } catch (err) {
    console.error('Error inserting CSV data:', err.message);
  }
};

const insertPasses = async (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');  // Ανάγνωση του ανεβασμένου αρχείου

    const rows = data.split('\n').slice(1);  // Παράβλεψη της επικεφαλίδας
    
    for (const row of rows) {
      const values = row.split(',').map(value => value.trim().replace(/"/g, ''));
      
      if (values.length !== 5) {
        continue;
      }
      const query = `
        INSERT INTO passes (timestamp, tollId, tagRef, tagHomeId, charge)
        VALUES (?, ?, ?, ?, ?)
      `;
      
      await db.query(query, values);
    }
    
    console.log('CSV data inserted successfully!');
  } catch (err) {
    console.error('Error inserting CSV data:', err.message);
  }
};

const resetAdmin = async () => {
  try {

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('freepasses4all', salt);

    // Check if the admin user exists
    const adminExists = await checkRecordExists('users', 'username', 'admin');

    if (adminExists) {
      // Update the existing admin user
      const updateQuery = `
        UPDATE users
        SET password = ?, access_level = 'admin'
        WHERE username = 'admin'
      `;
      await db.query(updateQuery, [hashedPassword]);
      console.log('Admin updated successfully');
    } else {
      // Insert a new admin user
      const insertQuery = `
        INSERT INTO users (username, password, access_level)
        VALUES ('admin', ?, 'admin')
      `;
      await db.query(insertQuery, [hashedPassword]);
      console.log('Admin created successfully');
    }
  } catch (err) {
    throw new Error(`Failed to reset admin: ${err.message}`);
  }
};


const countDistinct = async (tableName, column) => {
  try {
    const query = `SELECT COUNT(DISTINCT ??) AS count FROM ??`;

    const [results] = await db.query(query, [column, tableName]);

    return results[0].count;
  } catch (err) {
    throw new Error(`Failed to count distinct values: ${err.message}`);
  }
};

const countTotal = async (tableName) => {
  try {
    const query = `SELECT COUNT(*) AS count FROM ??`;

    const [results] = await db.query(query, [tableName]);

    return results[0].count;
  } catch (err) {
    throw new Error(`Failed to count values: ${err.message}`);
  }
};


async function getTollStationPasses(tollId, start, end) {
  const query = `
      SELECT 
          ts.tollId AS stationID,
          tc.operator AS stationOperator,
          p.passId AS passID,
          p.timestamp,
          p.tagRef AS tagID,
          p.tagHomeId AS tagProvider,
          p.charge AS passCharge,
          ts.opId AS stationOperator
      FROM passes p
      JOIN tollStations ts ON p.tollId = ts.tollId
      JOIN tollCompanies tc ON ts.opId = tc.opId
      WHERE p.tollId = ?
      AND DATE(p.timestamp) BETWEEN ? AND ?
      ORDER BY 
        p.timestamp ASC;
  `;
  const params = [tollId, start, end];

  try {
      const [rows] = await db.execute(query, params);
      console.log('Executed Query:', query);
      console.log('Query Params:', params);
      console.log('Query Result:', rows);
      return rows;
  } catch (error) {
      console.error('Database Query Error:', error.message);
      throw error;
  }
}

async function getPassAnalysis(tagOpID, stationOpID, start, end) {
  const query = `
      SELECT 
        p.passId AS passID, 
        t.tollId AS stationID,
        p.timestamp, 
        p.tagRef AS tagID,
        p.charge AS passCharge
      FROM 
        tollStations t
      JOIN 
        passes p 
      ON 
        t.tollId = p.tollId
      WHERE 
        t.opId = ?
        AND p.tagHomeId = ?
        AND p.timestamp BETWEEN ? AND ?
      ORDER BY 
        p.timestamp ASC;
    `;

const [rows] = await db.execute(query, [tagOpID, stationOpID, start, end]);
console.log('Query Results:', rows);
return rows;
}

async function getPassesCost(tollOpID, tagOpID, start, end) {
  const query = `
        SELECT 
            COUNT(*) AS nPasses, 
            SUM(p.charge) AS passesCost
        FROM 
            tollStations t
        JOIN 
            passes p 
        ON 
            t.tollId = p.tollId
        WHERE 
            t.opId = ?
            AND p.tagHomeId = ?
            AND p.timestamp BETWEEN ? AND ?;
    `;
  const [rows] = await db.execute(query, [tollOpID, tagOpID, start, end]);
  return rows;
}


async function getChargesBy(tollId, start, end) {
    const query = `
      SELECT 
          p.tagHomeId AS visitingOpID,
          COUNT(*) AS nPasses,
          ROUND(SUM(p.charge), 2) AS passesCost
      FROM passes p
      JOIN tollStations ts ON p.tollId = ts.tollId
      WHERE ts.opId = ? 
        AND DATE(p.timestamp) BETWEEN ? AND ?
      GROUP BY p.tagHomeId
      ORDER BY p.tagHomeId;
  `;
  const [rows] = await db.execute(query, [tollId, start, end]);
  return rows;
}

async function getUsers() {
  try {
    const query = `
        SELECT username
        FROM users
    `;
    const [rows] = await db.execute(query); // Assuming db is properly set up
    return rows;
  } catch (error) {
    console.error("Error fetching users:", error.message);
    return [];
  }
}


const updateUserPassword = async (username, newPassword) => {
  try {
    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const query = `
      UPDATE users 
      SET password = ? 
      WHERE username = ?
    `;

    const [result] = await db.query(query, [hashedPassword, username]);
    if (result.affectedRows > 0) {
      console.log("Password updated successfully.");
    } else {
      console.log("User not found.");
    }
  } catch (error) {
    console.error("Error updating password:", error.message);
  }
};


// Export the configuration and utility functions
module.exports = {
  checkRecordExists,
  truncate,
  initStations,
  countDistinct,
  resetAdmin,
  registerUser,
  countTotal,
  insertPasses,
  getTollStationPasses,
  getPassAnalysis,
  getPassesCost,
  getChargesBy,
  getUsers,
  updateUserPassword
};
