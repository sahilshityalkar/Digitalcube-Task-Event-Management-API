const express = require('express');
const router = express.Router();
const { createEvent, getAllEvents } = require('../controllers/eventController');
const upload = require('../middleware/upload');

// POST /events - Create a new event with file upload
router.post('/events', upload.single('image'), createEvent);

// GET /events - Retrieve all events with pagination
router.get('/events', getAllEvents);

module.exports = router;
