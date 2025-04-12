const jwt = require("jsonwebtoken");  
const bcrypt = require("bcryptjs");    
const { checkRecordExists } = require("../db/mySqlFuncs"); 

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username or Password fields cannot be empty!" });
  }

  try {
    const existingUser = await checkRecordExists("users", "username", username);

    if (!existingUser) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const passwordMatch = await bcrypt.compare(password, existingUser.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign(
      { username: existingUser.username, access_level: existingUser.access_level },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Set token as an HTTP-only cookie
    res.cookie("auth_token", token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    res.status(200).json({
      token,
      redirect: existingUser.access_level === 'admin' ? '/api/admin' : `/api/dashboard?username=${encodeURIComponent(username)}`,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


// Export the login controller for use in routes
module.exports = {
  login,
};