const validateTimePeriod = (req, res, next) => {
    const { start, end, tollId, type} = req.body;

    if (!start || !end || !tollId) {
        return res.status(400).json({ error: "Start date or end date cannot be empty!" });
    }
    next(); // Proceed to the next middleware/route handler
};

module.exports = validateTimePeriod;