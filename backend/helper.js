const User = require("./models/user");
var admin = require("firebase-admin");
require('dotenv/config');

var serviceAccount = require("./snackbud-5911d-firebase-adminsdk-btpru-23d7cc7f93.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

class helpers {

    constructor() {
    }

    printToConsole(event) {
        console.log('sending push notification for:');
        console.log(event);
    }

    notifyHelper(elem, title, body) {
        // try {
        // send messages to guests
        var message = {
            notification: {
                title,
                body
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
        //   } catch (err) {
        //         console.log(err);
        //         return;
        //     }
    }

    // tell the guests about the meetup creation
    notifyNewMeetup(event, helper = this) {
        console.log('guests:' + event.guestIds);

        // get host name
        User.findOne({ 'userId': event.hostId }, {}, function (err, host) {
            if (err) {
                //res.send(err);
                console.log(err);
                return;
            }
            console.log('host is:' + host.userId);
            // get the deviceToken of the guests
            var i;
            for (i = 0; i < event.guestIds.length; i++) {
                let userId = event.guestIds[parseInt(i, 10)];
                User.findOne({ 'userId': userId.guestId }, {}, function (err, guest) {
                    if (err) {
                        //res.send(err);
                        console.log(err);
                        return;
                    }
                    // send messages to guests
                    helper.notifyHelper(guest, 'You are invited to a meetup with ' + host.username + '!',
                        'The meetup will be at ' + event.restName + ' at ' + new Date(event.timeOfMeet));
                });
            }
        });
    }

    //listener helper for the host to see if the meetup has been verified
    notifyNoVerifyMeetup(guest, helper = this) {
        console.log('No Verify meet for: ' + guest.userId);
        // send messages to guest
        helper.notifyHelper(guest, 'You have entered an invalid code!', 'Please try again');
    }

    //listener helper for the host to see if the meetup has been verified
    notifyVerifyMeetup(event, guest, helper = this) {
        console.log('Verify meet for: ' + event.hostId);
        if (event.hostId === guest.userId) {
            console.log("verifying meetup as the host, returning");
            return;
        }
        var body = 'We hope you enjoyed ' + event.restName + ' today! Thanks for using SnackBud!';

        // get host 
        User.findOne({ 'userId': event.hostId }, {}, function (err, host) {
            if (err) {
                //TODO: Cannot use res here safely
                // res.send(err);
                console.log(err);
            }
            console.log('host is:' + host.userId);
            // send messages to host
            helper.notifyHelper(host, guest.username + ' has verified your meetup with you!', body);
            // send messages to guest
            helper.notifyHelper(guest, 'You have verified your meetup with ' + host.username + '!', body);
        });
    }


    notifyEnterCode(event, helper = this) {
        console.log('guests:' + event.guestIds);
        // get host
        User.findOne({ 'userId': event.hostId }, {}, function (err, host) {
            if (err) {
                // res.send(err);
                console.log(err);
            }
            console.log('host is:' + host.userId);
            // send messages to host
            this.notifyHelper(host, 'Your meetup verification code is ' + event.verifyCode,
                'Please have the guests enter this code to verify the meetup!');

            // get the deviceToken of the guests
            for (var i = 0; i < event.guestIds.length; i++) {
                let userId = event.guestIds[parseInt(i, 10)];
                User.findOne({ 'userId': userId.guestId }, {}, function (err, guest) {
                    if (err) {
                        // res.send(err);
                        console.log(err);
                    }
                    // send messages to guests
                    helper.notifyHelper(guest, host.username + '\'s meetup verification code is unlocked',
                        'Please get and enter their code to verify the meetup!');
                });

            }
        });
    }
}

module.exports = helpers;