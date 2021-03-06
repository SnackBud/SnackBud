const admin = require("firebase-admin");
const User = require("./models/user");

const serviceAccount = require("./snackbud-5911d-firebase-adminsdk-btpru-23d7cc7f93.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

class helpers {
  //   constructor() {
  //   }

  notifyHelper(elem, title, body) {
    // console.log("notifyHelper called");

    // check for bad calls
    if (!(elem == null || elem.deviceToken == null || elem.username === "unknown user")) {

      // send messages to guests
      const message = {
        notification: {
          title,
          body,
        },
        token: elem.deviceToken,
      };
      // console.log(message);

      // registration token.
      admin.messaging().send(message)
        .then((response) => {
          return response;
        })
        .catch((error) => {
          return error;
        });
    }
  }

  // tell the guests about the meetup creation
  notifyNewMeetup(event, helper = this) {

    // get host name
    User.findOne({ userId: event.hostId }, {}, (err, host) => {
      if (err || host == null) {
        return;
      }
      // console.log(host);
      // get the deviceToken of the guests
      for (let i = 0; i < event.guestIds.length; i++) {
        const user = event.guestIds[parseInt(i, 10)];
        User.findOne({ userId: user.guestId }, {}, (err, guest) => {
          if (!err) {
            // send messages to guests
            helper.notifyHelper(guest, `You are invited to a meetup with ${host.username}, The meetup will be at ${event.restName} at ${new Date(event.timeOfMeet)}`);
          }
        });
      }

      // send messages to host
      helper.notifyHelper(host, `Your meetup at ${event.restName} has been created!`);
    });
  }

  // listener helper for the host to see if the meetup has been verified
  notifyNoVerifyMeetup(guest, helper = this) {
    // console.log("No Verify meet for: " + guest.userId);
    // send messages to guest

    helper.notifyHelper(guest, "You have failed to verify this meetup!",
      "Either your verify code is wrong or you are the host! Please try again");
  }

  // listener helper for the host to see if the meetup has been verified
  notifyVerifyMeetup(event, guest, helper = this) {

    if (event.hostId === guest.userId) {
      // console.log("verifying meetup as the host, returning");
      User.findOne({ userId: event.hostId }, {}, (err, host) => {
        if (!err && host) {

          // send messages to host
          helper.notifyHelper(host, `${host.username} you cannot verify your own event!`,
            "Please send the verification code to your friends so they can verify!");
        }
      });
      return;
    }

    const body = `We hope you enjoyed ${event.restName} today! Thanks for using SnackBud!`;
    // get host
    User.findOne({ userId: event.hostId }, {}, (err, host) => {
      if (!err && host) {
        // console.log("host is:" + host.userId);
        // send messages to host
        helper.notifyHelper(host, `${guest.username} has verified your meetup with you!`, body);
        // send messages to guest
        helper.notifyHelper(guest, `You have verified your meetup with ${host.username}!`, body);
      }
    });
  }

  // notifyEnterCode(event, helper = this) {

  //   if (typeof event === "undefined" || event == null) {
  //     return;
  //   }

  //   // get host
  //   User.findOne({ userId: event.hostId }, {}, function (err, host) {
  //     if (err) {
  //       // res.send(err);
  //       // console.log(err);
  //       return;
  //     }
  //     // console.log("host is:" + host.userId);
  //     // send messages to host
  //     helper.notifyHelper(host, `Your meetup verification code is ${event.verifyCode}`,
  //       "Please have the guests enter this code to verify the meetup!");

  //     // get the deviceToken of the guests
  //     for (let i = 0; i < event.guestIds.length; i++) {
  //       const userId = event.guestIds[parseInt(i, 10)];
  //       User.findOne({ userId: userId.guestId }, {}, (err, guest) => {
  //         if (err) {
  //           // res.send(err);
  //           // console.log(err);
  //           return;
  //         }
  //         // send messages to guests
  //         helper.notifyHelper(guest, `${host.username}"s meetup verification code is unlocked`,
  //           "Please get and enter their code to verify the meetup!");
  //       });
  //     }
  //   });
  // }
}

module.exports = helpers;
