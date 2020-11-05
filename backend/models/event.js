const mongoose = require('mongoose');
const maxCode = 999;
const meetup = new mongoose.Schema({
    eventId: String,
    hostId: {
        type: String,
        required: true
    },
    guestIds: [{
        guestId: {
            type: String,
            required: true
        }
    }],
    restId: {
        type: String,
        required: true
    },
    restName: {
        type: String,
        required: true
    },
    timeOfMeet: {
        type: Number,
        required: true
    },
    timeOfCreation: {
        type: Number,
        default: new Date().getTime()
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verifyCode: {
        type: String,
        default: Math.floor(Math.random() * Math.floor(maxCode))
    },
});

module.exports = mongoose.model('meetup', meetup); 