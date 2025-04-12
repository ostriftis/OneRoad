const express = require("express");           
const cors = require("cors");                 
const path = require("path");                 
const authRoutes = require('./back-end/routes/authRoutes.js'); 
const adminRoutes = require("./back-end/routes/adminRoutes.js"); 
const timeRoutes = require('./back-end/routes/timeRoutes.js'); 
const { authenticate, authorize } = require('./back-end/login/authMiddleware'); 
const { testDB } = require("./back-end/db/dbConfig");
const favicon = require('serve-favicon');

testDB();

const public = path.join('front-end', 'public');

// Initialize Express app
const app = express();
app.use(favicon(path.join(__dirname, public, 'logo.png')));

// Import middleware to parse cookies
const cookieParser = require("cookie-parser");
app.use(cookieParser()); // Use cookie-parser middleware to parse cookies

const port = process.env.PORT;

// Serve static files (e.g., HTML, CSS, JS) from the 'public' folder
app.use(express.static(path.join(__dirname, public)));

// Enable CORS (Cross-Origin Resource Sharing)
app.use(cors());

// Middleware to parse JSON data in incoming requests
app.use(express.json());

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: false }));

// Use authentication routes for all root-level endpoints ("/")
app.use('/', authRoutes);

// Redirect the root URL ("/") to the API home page
app.get('/', (req, res) => {
    res.redirect('/api');
});

// Serve the main API page
app.get('/api', (req, res) => {
    res.sendFile(path.join(__dirname, public, 'index.html'));
});

// Serve the login page
app.get('/api/login', (req, res) => {
    res.sendFile(path.join(__dirname, public, 'loginPage.html'));
});

// Serve the dashboard page with a personalized welcome message
app.get('/api/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, public, 'dashboard.html'));
});

// Serve a main data page
app.get('/api/stats', (req, res) => {
    res.sendFile(path.join(__dirname, public, 'stats.html'));
});

app.use((req, res, next) => {
    res.setHeader('X-Custom-Header-Check', 'MiddlewareCheck');
    next();
});
// Serve a page for statistics about TollStationPasses
app.get('/api/tollStationPasses', (req, res) => {
    res.sendFile(path.join(__dirname, public, 'tollStationPasses.html'));
});

// Serve a page for statistics about passAnalysis
app.get('/api/passAnalysis', (req, res) => {
    res.sendFile(path.join(__dirname, public, 'passAnalysis.html'));
});

// Serve a page for statistics about passesCost
app.get('/api/passesCost', (req, res) => {
    res.sendFile(path.join(__dirname, public, 'passesCost.html'));
});

// Serve a page for statistics about chargesBy
app.get('/api/chargesBy', (req, res) => {
    res.sendFile(path.join(__dirname, public, 'chargesBy.html'));
});

app.get('/api/debts', (req, res) => {
    res.sendFile(path.join(__dirname, public, 'debts.html'));
});

// Use admin routes for endpoints starting with "/api/admin"
app.use("/api/admin", adminRoutes);

app.use(timeRoutes);
app.use((req, res, next) => {
    const format = req.query.format;
    if (format === 'csv') {
        res.setHeader('Content-Type', 'text/csv');
    } else {
        res.setHeader('Content-Type', 'application/json');
    }
    console.log('Content-Type set to:', res.getHeader('Content-Type'));
    next();
});

// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
