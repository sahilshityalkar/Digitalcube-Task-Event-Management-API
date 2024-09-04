const Event = require('../models/eventModel');
const Registration = require('../models/registrationModel');
const Joi = require('joi');
const nodemailer = require('nodemailer');

// Define the validation schema using Joi for event creation
const eventSchema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    description: Joi.string().min(10).max(1024).required(),
    date: Joi.date().greater('now').required(),
    location: Joi.string().min(3).max(255).required(),
});

// Define the validation schema using Joi for event updates
const updateEventSchema = Joi.object({
    name: Joi.string().min(3).max(255),
    description: Joi.string().min(10).max(1024),
    date: Joi.date().greater('now'),
    location: Joi.string().min(3).max(255),
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
            imageUrl: req.file ? req.file.path : undefined
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
            imageUrl: req.file ? req.file.path : undefined
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

// Controller function to register a user for an event and send a confirmation email
const registerForEvent = async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;

    // Basic validation
    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required.' });
    }

    try {
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        // Ensure no more than 15 bookings for secure server, this is optional
        const registrationCount = await Registration.countDocuments({ eventId: id });
        if (registrationCount >= 15) {
            return res.status(400).json({ error: 'Event is fully booked.' });
        }

        const newRegistration = new Registration({
            eventId: id,
            name,
            email
        });

        await newRegistration.save();

        // Setup Nodemailer transport with Ethereal
        let transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: process.env.ETHEREAL_USER,
                pass: process.env.ETHEREAL_PASS  
            }
        });

        // Send confirmation email
        let info = await transporter.sendMail({
            from: '"Event Management" <noreply@events.com>',
            to: email,
            subject: 'Registration Confirmation',
            text: `Hi ${name},\n\nYou have successfully registered for the event: ${event.name}.\n\nThank you!`,
            html: `<p>Hi ${name},</p><p>You have successfully registered for the event: <strong>${event.name}</strong>.</p><p>Thank you!</p>`
        });

        res.status(200).json({
            message: 'Registration successful, confirmation email sent.',
            registration: newRegistration,
            emailInfo: info
        });
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while registering for the event.' });
    }
};

module.exports = { createEvent, getAllEvents, getEventById, updateEventById, deleteEventById, registerForEvent };
