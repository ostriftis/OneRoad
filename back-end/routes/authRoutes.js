const express = require("express");
const { login } = require("../login/authControllers");
const router = express.Router();

router.post("/api/login", login);
router.post("/api/failedLogin", login);

// Logout Route
router.post('/api/logout', (req, res) => {
    // Clear the 'auth_token' cookie
    res.clearCookie("auth_token", { httpOnly: true, path: '/' });

    // Redirect the user to the login page or send a success response
    res.status(200).json({ message: "Logout successful" });
});

module.exports = router;
