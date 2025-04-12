const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const token = req.cookies.auth_token;

  if (!token) {
    return res.status(401).send("<h1>ERROR 401: Unauthorized Access");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info (username, access_level) to req object
    next();
  } catch (err) {
    return res.status(403).redirect('/api/failedLogin');
  }
};

const authorize = (accessLevels) => {
  return (req, res, next) => {
    // Check if the user's access_level is allowed
    if (!accessLevels.includes(req.user.access_level)) {
      return res.status(403).send("Access Denied");
    }
    next();
  };
};

module.exports = { authenticate, authorize };
