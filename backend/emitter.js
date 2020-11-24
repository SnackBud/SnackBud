const { EventEmitter } = require("events");
const Helpers = require("./helper");

const pushNotify = new EventEmitter();

const helper = new Helpers();

// First listener for new meetup
pushNotify.on("newMeetup", (event) => {
  helper.notifyNewMeetup(event);
});

// First listener for new meetup
pushNotify.on("verifyMeetup", (event, guest) => {
  helper.notifyVerifyMeetup(event, guest);
});

// First listener for new meetup
pushNotify.on("noVerifyMeetup", (guest) => {
  helper.notifyNoVerifyMeetup(guest);
});

// listener for guests when the host unlocks the verification code
pushNotify.on("enterCode", (event) => {
  helper.notifyEnterCode(event);
});

// listener for guests when the host unlocks the verification code
pushNotify.on("contactTrace", (sickUser, atRiskUser, event) => {
  helper.notifyHelper(atRiskUser, `${sickUser.username} has COVID-19 symptoms! You were in contact with them in the last two weeks!`,
    `This was at ${event.restName}on ${new Date(event.timeOfMeet)} or sooner potentially!`);
});

// listener for guests when the host unlocks the verification code
pushNotify.on("finishContactTrace", (sickUser, numNotified) => {
  const body = "Please do not create any more meetups or leave your home until you are better!";
  if (numNotified > 0) {
    helper.notifyHelper(sickUser, `${sickUser.username}, we have notified ${numNotified} people we have on record as having met with you.`,
      body);
  } else {
    helper.notifyHelper(sickUser, `${sickUser.username}, you have not met with anyone through SnackBud in at least 2 weeks, don"t worry.`,
      body);
  }
});

module.exports = pushNotify;
