const mongoose = require("mongoose");

const maxCode = 899;
const meetup = new mongoose.Schema({
  eventId: String,
  hostId: {
    type: String,
    required: true,
  },
  guestIds: [{
    guestId: {
      type: String,
      required: true,
    },
  }],
  restId: {
    type: String,
    required: true,
  },
  restName: {
    type: String,
    required: true,
  },
  timeOfMeet: {
    type: Number,
    required: true,
  },
  timeOfCreation: {
    type: Number,
    default: new Date().getTime(),
  },
  notVerified: [{
    guestId: {
      type: String,
    },
  }],
  isVerified:{
    type: Boolean,
    default: false,
  },
  verifyCode: {
    type: String,
    default: Math.floor(Math.random() * maxCode + 100),
  },
});

module.exports = mongoose.model("meetup", meetup);
