const Event = require('../models/eventModel'); 
const Joi = require('joi'); 

// Define the validation schema using Joi
const eventSchema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    description: Joi.string().min(10).max(1024).required(),
    date: Joi.date().greater('now').required(),
    location: Joi.string().min(3).max(255).required(),
});

// Controller function to create a new event
const createEvent = async (req, res) => {
    
    const { error } = eventSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        
        const newEvent = new Event(req.body);
        await newEvent.save();

        res.status(201).json({
            message: 'Event created successfully',
            event: newEvent,
        });
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while creating the event' });
    }
};

// Controller function to retrieve all events
const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json(events);
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while retrieving events' });
    }
};

module.exports = { createEvent, getAllEvents };
