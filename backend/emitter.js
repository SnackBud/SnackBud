const express = require('express');
const { EventEmitter } = require('events');
const User = require("./models/user");
var admin = require("firebase-admin");
require('dotenv/config');

var serviceAccount = require("./snackbud-5911d-firebase-adminsdk-btpru-23d7cc7f93.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

const pushNotify = new EventEmitter();

// First listener for new meetup
pushNotify.on('newMeetup', async function firstListener(event) {
    printToConsole(event);
    await notifyNewMeetup(event);
});

// First listener for new meetup
pushNotify.on('verifyMeetup', async function firstListener(event, guest) {
    printToConsole(event);
    await notifyVerifyMeetup(event, guest);
});

// First listener for new meetup
pushNotify.on('noVerifyMeetup', async function firstListener(guest) {
    printToConsole(guest);
    await notifyNoVerifyMeetup(guest);
});

//listener for guests when the host unlocks the verification code
pushNotify.on('enterCode', async function firstListener(event) {
    printToConsole(event);
    await notifyEnterCode(event);
});

//listener for guests when the host unlocks the verification code
pushNotify.on('contactTrace', async function firstListener(sickUser, atRiskUser, event) {
    printToConsole(event);
    notifyHelper(atRiskUser, sickUser.username + ' has COVID-19 symptoms! You were in contact with them in the last two weeks!',
        'This was at ' + event.restName + 'on ' + new Date(event.timeOfMeet) + ' or sooner potentially!');
});

//listener for guests when the host unlocks the verification code
pushNotify.on('finishContactTrace', async function firstListener(sickUser, numNotified) {
    printToConsole(sickUser);
    if (numNotified > 0) {
        notifyHelper(sickUser, sickUser.username + ', we have notified ' + numNotified + ' people we have on record as having met with you.',
            'Please do not create any more meetups or leave your home until you are better!');
    } else {
        notifyHelper(sickUser, sickUser.username + ', you have not met with anyone through SnackBud in at least 2 weeks, don\'t worry.',
            'Please do not create any more meetups or leave your home until you are better!');
    }
});

function printToConsole(event) {
    console.log('sending push notification for:');
    console.log(event);
}

async function notifyHelper(elem, title, body) {
    try {
    // send messages to guests
    var message = {
        notification: {
            title: title,
            body: body
        },
        token: elem.deviceToken
    };
    console.log('sending message to ' + elem.userId + ', message:');
    console.log(message);

    // registration token.
    admin.messaging().send(message)
        .then((response) => {
            // Response is a message ID string.
            console.log('Successfully sent message:', response);
        })
        .catch((error) => {
            console.log('Error sending message:', error);
        });
    } catch (err) {
        console.log(err);
        return;
    }
}

// tell the guests about the meetup creation
async function notifyNewMeetup(event) {
    console.log('guests:' + event.guestIds);

    // get host name
    User.findOne({ 'userId': event.hostId }, {}, function (err, host) {
        console.log('host is:' + host.userId);
        // get the deviceToken of the guests
        var i;
        for (i = 0; i < event.guestIds.length; i++) {
            User.findOne({ 'userId': event.guestIds[i].guestId }, {}, function (err, guest) {
                if (err) {
                    //res.send(err);
                    console.log(err);
                    return;
                }
                // send messages to guests
                notifyHelper(guest, 'You are invited to a meetup with ' + host.username + '!',
                    'The meetup will be at ' + event.restName + ' at ' + new Date(event.timeOfMeet));
            });
        }
    });
}

//listener helper for the host to see if the meetup has been verified
async function notifyNoVerifyMeetup(guest) {
    console.log('No Verify meet for: ' + guest.userId);
        // send messages to guest
        notifyHelper(guest, 'You have entered an invalid code!', 'Please try again');
}

//listener helper for the host to see if the meetup has been verified
async function notifyVerifyMeetup(event, guest) {
    console.log('Verify meet for: ' + event.hostId);
    if (event.hostId == guest.userId) {
        console.log("verifying meetup as the host, returning");
        return;
    }
    var body = 'We hope you enjoyed ' + event.restName + ' today! Thanks for using SnackBud!';

    // get host 
    User.findOne({ 'userId': event.hostId }, {}, function (err, host) {
        if (err) {
            res.send(err);
            console.log(err);
        }
        console.log('host is:' + host.userId);
        // send messages to host
        notifyHelper(host, guest.username + ' has verified your meetup with you!', body);
        // send messages to guest
        notifyHelper(guest, 'You have verified your meetup with ' + host.username + '!', body);
    });
}


async function notifyEnterCode(event) {
    console.log('guests:' + event.guestIds);
    // get host
    User.findOne({ 'userId': event.hostId }, {}, function (err, host) {
        if (err) {
            res.send(err);
            console.log(err);
        }
        console.log('host is:' + host.userId);
        // send messages to host
        notifyHelper(host, 'Your meetup verification code is ' + event.verifyCode,
            'Please have the guests enter this code to verify the meetup!');

        // get the deviceToken of the guests
        for (var i = 0; i < event.guestIds.length; i++) {
            User.findOne({ 'userId': event.guestIds[i].guestId }, {}, function (err, guest) {
                if (err) {
                    res.send(err);
                    console.log(err);
                }
                // send messages to guests
                notifyHelper(guest, host.username + '\'s meetup verification code is unlocked',
                    'Please get and enter their code to verify the meetup!');
            });

        }
    });
}


//error handling
pushNotify.on('error', (err) => {
    console.error('whoops! there was an error bro!' + err);
});


module.exports = pushNotify;