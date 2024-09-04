const mongoose = require('mongoose');

// Define the event schema
const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    date: {
        type: Date,
        required: true,
        validate: {
            validator: function(value) {
                return value > Date.now();  // Date should be in the future
            },
            message: 'Date must be in the future',
        },
    },
    location: {
        type: String,
        required: true,
        trim: true,
    },
    imageUrl: {
        type: String, // URL of the uploaded image
        default: null
    }
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
