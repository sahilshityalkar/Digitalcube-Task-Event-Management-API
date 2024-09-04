const express = require('express');
const router = express.Router();
const { createEvent } = require('../controllers/eventController');

// POST /events - Create a new event
router.post('/events', createEvent);

module.exports = router;
