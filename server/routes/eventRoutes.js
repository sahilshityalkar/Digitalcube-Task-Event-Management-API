const express = require('express');
const router = express.Router();
const { createEvent, getAllEvents, getEventById, updateEventById, deleteEventById, registerForEvent } = require('../controllers/eventController');
const upload = require('../middleware/upload');

// POST /events - Create a new event with file upload
router.post('/events', upload.single('image'), createEvent);

// GET /events - Retrieve all events with pagination
router.get('/events', getAllEvents);

// GET /events/:id - Retrieve an event by ID
router.get('/events/:id', getEventById);

// PUT /events/:id - Update an event by ID
router.put('/events/:id', upload.single('image'), updateEventById);

// DELETE /events/:id - Delete an event by ID
router.delete('/events/:id', deleteEventById);

// POST /events/:id/register - Register a user for an event
router.post('/events/:id/register', registerForEvent);

module.exports = router;
