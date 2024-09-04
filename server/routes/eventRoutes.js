const express = require('express');
const router = express.Router();
const { createEvent, getAllEvents } = require('../controllers/eventController');

// POST /events - Create a new event
router.post('/events', createEvent);

// GET /events - Retrieve all events
router.get('/events', getAllEvents);

module.exports = router;
