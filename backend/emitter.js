const { EventEmitter } = require('events');
const helpers = require('./helper');
const pushNotify = new EventEmitter();

const helper = helpers();

// First listener for new meetup
pushNotify.on('newMeetup', function firstListener(event) {
    helper.printToConsole(event);
    helper.notifyNewMeetup(event);
});

// First listener for new meetup
pushNotify.on('verifyMeetup', function firstListener(event, guest) {
    helper.printToConsole(event);
    helper.notifyVerifyMeetup(event, guest);
});

// First listener for new meetup
pushNotify.on('noVerifyMeetup', function firstListener(guest) {
    helper.printToConsole(guest);
    helper.notifyNoVerifyMeetup(guest);
});

//listener for guests when the host unlocks the verification code
pushNotify.on('enterCode', function firstListener(event) {
    helper.printToConsole(event);
    helper.notifyEnterCode(event);
});

//listener for guests when the host unlocks the verification code
pushNotify.on('contactTrace', function firstListener(sickUser, atRiskUser, event) {
    helper.printToConsole(event);
    helper.notifyHelper(atRiskUser, sickUser.username + ' has COVID-19 symptoms! You were in contact with them in the last two weeks!',
        'This was at ' + event.restName + 'on ' + new Date(event.timeOfMeet) + ' or sooner potentially!');
});

//listener for guests when the host unlocks the verification code
pushNotify.on('finishContactTrace', function firstListener(sickUser, numNotified) {
    const body = 'Please do not create any more meetups or leave your home until you are better!';
    helper.printToConsole(sickUser);
    if (numNotified > 0) {
        helper.notifyHelper(sickUser, sickUser.username + ', we have notified ' + numNotified + ' people we have on record as having met with you.',
            body);
    } else {
        helper.notifyHelper(sickUser, sickUser.username + ', you have not met with anyone through SnackBud in at least 2 weeks, don\'t worry.',
            body);
    }
});

//error handling
pushNotify.on('error', (err) => {
    console.error('whoops! there was an error bro!' + err);
});

module.exports = pushNotify;