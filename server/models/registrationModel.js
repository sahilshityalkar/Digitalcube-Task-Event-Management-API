const mongoose = require('mongoose');

// Define the registration schema
const registrationSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        match: [/.+@.+\..+/, 'Please enter a valid email address']
    }
});

const Registration = mongoose.model('Registration', registrationSchema);

module.exports = Registration;
