const Event = require('../models/eventModel');
const Joi = require('joi');

// Define the validation schema using Joi
const eventSchema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    description: Joi.string().min(10).max(1024).required(),
    date: Joi.date().greater('now').required(),
    location: Joi.string().min(3).max(255).required(),
    // imageUrl is handled separately
});

// Controller function to create a new event
const createEvent = async (req, res) => {
    const { error } = eventSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        const newEvent = new Event({
            ...req.body,
            imageUrl: req.file ? req.file.path : undefined // Add imageUrl if file is uploaded
        });
        await newEvent.save();

        res.status(201).json({
            message: 'Event created successfully',
            event: newEvent,
        });
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while creating the event' });
    }
};

// Controller function to retrieve all events with pagination
const getAllEvents = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const events = await Event.find().skip(skip).limit(limit);
        const totalEvents = await Event.countDocuments();

        res.status(200).json({
            totalEvents,
            page,
            totalPages: Math.ceil(totalEvents / limit),
            events
        });
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while retrieving events' });
    }
};

module.exports = { createEvent, getAllEvents };
