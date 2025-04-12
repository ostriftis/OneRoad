const express = require("express");
const router = express.Router();
const path = require("path");                 
const multer = require('multer');

const { authenticate, authorize } = require('../login/authMiddleware');
const { resetStations } = require("../admin/resetStations");
const { healthCheck } = require("../admin/healthCheck"); 
const { resetPasses } = require("../admin/resetPasses");
const { addPasses }   = require("../admin/addPasses");
//const { insertPasses } = require("../db/mySqlFuncs");

const public = path.join('../', '../', 'front-end', 'public');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Specify your uploads folder here
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Store with a unique filename
    }
});

const upload = multer({ storage: storage });


router.use(authenticate, authorize(['admin']));

// Serve the admin dashboard page, protected by authentication and authorization middleware
router.get('/', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, public, 'adminDashboard.html'));
});

// Import healthCheck handler from a separate file
 
router.get('/healthcheck', async (req, res) => {

    const healthStatus = await healthCheck();

    // Send the response from healthCheck
    const stat = (healthStatus.status === 'OK' ? 200 : 401);
    res.status(stat).json(healthStatus);
});

router.post('/resetPasses', async (req, res) => {
    const resetStatus = await resetPasses();
    res.status(resetStatus.status === "OK" ? 200 : 401).json(resetStatus);
});

router.post('/resetStations', async (req, res) => {
    const resetStatus = await resetStations();
    res.status(resetStatus.status === "OK" ? 200 : 401).json(resetStatus);
});

router.post('/addpasses', upload.single('file'), addPasses);

module.exports = router;  
