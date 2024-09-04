const express = require('express');
const router = express.Router();
const { createEvent, getAllEvents, getEventById } = require('../controllers/eventController');
const upload = require('../middleware/upload');

// POST /events - Create a new event with file upload
router.post('/events', upload.single('image'), createEvent);

// GET /events - Retrieve all events with pagination
router.get('/events', getAllEvents);

// GET /events/:id - Retrieve an event by ID
router.get('/events/:id', getEventById);

module.exports = router;
