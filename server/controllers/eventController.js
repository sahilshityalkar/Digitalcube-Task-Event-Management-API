const Event = require('../models/eventModel');
const Joi = require('joi');

// Define the validation schema using Joi for updates
const updateEventSchema = Joi.object({
    name: Joi.string().min(3).max(255),
    description: Joi.string().min(10).max(1024),
    date: Joi.date().greater('now'),
    location: Joi.string().min(3).max(255),
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

// Controller function to retrieve an event by ID
const getEventById = async (req, res) => {
    const { id } = req.params;

    try {
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.status(200).json(event);
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while retrieving the event' });
    }
};

// Controller function to update an event by ID
const updateEventById = async (req, res) => {
    const { id } = req.params;
    const { error } = updateEventSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        const updatedEventData = {
            ...req.body,
            imageUrl: req.file ? req.file.path : undefined // Update imageUrl if a new file is uploaded
        };

        const updatedEvent = await Event.findByIdAndUpdate(id, updatedEventData, { new: true, runValidators: true });

        if (!updatedEvent) {
            return res.status(404).json({ error: 'Event not found' });
        }

        res.status(200).json({
            message: 'Event updated successfully',
            event: updatedEvent
        });
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while updating the event' });
    }
};

// Controller function to delete an event by ID
const deleteEventById = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedEvent = await Event.findByIdAndDelete(id);

        if (!deletedEvent) {
            return res.status(404).json({ error: 'Event not found' });
        }

        res.status(200).json({
            message: 'Event deleted successfully',
            event: deletedEvent
        });
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while deleting the event' });
    }
};

module.exports = { createEvent, getAllEvents, getEventById, updateEventById, deleteEventById };
