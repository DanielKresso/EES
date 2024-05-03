const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/timetable', (req, res) => {
    const timeTablePath = path.join(__dirname, 'timeTable.json');

    res.sendFile(timeTablePath, (err) => {
        if (err) {
            res.status(500).json({ "error": 'Error reading timetable file' });
        }
    });
});

module.exports = router;