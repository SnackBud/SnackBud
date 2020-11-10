const admin = require("firebase-admin");
const User = require("./models/user");
require("dotenv/config");

const serviceAccount = require("./snackbud-5911d-firebase-adminsdk-btpru-23d7cc7f93.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

class helpers {
//   constructor() {
//   }

  printToConsole(event) {
    // console.log("sending push notification for:");
    // console.log(event);
    return;
  }

  notifyHelper(elem, title, body) {
    // try {

    // check for bad calls
    if (elem == null) {
      return;
    }
    // send messages to guests
    const message = {
      notification: {
        title,
        body,
      },
      token: elem.deviceToken,
    };
    // console.log("sending message to " + elem.userId + ", message:");
    // console.log(message);

    // registration token.
    admin.messaging().send(message)
      .then((response) => {
        // Response is a message ID string.
        // console.log("Successfully sent message:", response);
        return;
      })
      .catch((error) => {
        // console.log("Error sending message:", error);
        return;
      });
    //   } catch (err) {
    //         console.log(err);
    //         return;
    //     }
  }

  // tell the guests about the meetup creation
  notifyNewMeetup(event, helper = this) {
    // console.log("guests:" + event.guestIds);

    // get host name
    User.findOne({ userId: event.hostId }, {}, (err, host) => {
      if (err) {
        // res.send(err);
        // console.log(err);
        return;
      }
      // console.log("host is:" + host.userId);
      // get the deviceToken of the guests
      let i;
      for (i = 0; i < event.guestIds.length; i++) {
        const userId = event.guestIds[parseInt(i, 10)];
        User.findOne({ userId: userId.guestId }, {}, (err, guest) => {
          if (err) {
            // res.send(err);
            // console.log(err);
            return;
          }
          // send messages to guests
          helper.notifyHelper(guest, `You are invited to a meetup with ${host.username}, The meetup will be at ${event.restName} at ${new Date(event.timeOfMeet)}`);
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
    // console.log("Verify meet for: " + event.hostId);
    if (event.hostId === guest.userId) {
      // console.log("verifying meetup as the host, returning");
      User.findOne({ userId: event.hostId }, {}, (err, host) => {
        if (err) {
          return;
        }
        // send messages to host
        helper.notifyHelper(host, `${host.username} you cannot verify your own event!`, 
        "Please send the verification code to your friends so they can verify!");
      });
      return;
    }
    const body = `We hope you enjoyed ${event.restName} today! Thanks for using SnackBud!`;

    // get host
    User.findOne({ userId: event.hostId }, {}, (err, host) => {
      if (err) {
        // TODO: Cannot use res here safely
        // res.send(err);
        // console.log(err);
        return;
      }
      // console.log("host is:" + host.userId);
      // send messages to host
      helper.notifyHelper(host, `${guest.username} has verified your meetup with you!`, body);
      // send messages to guest
      helper.notifyHelper(guest, `You have verified your meetup with ${host.username}!`, body);
    });
  }

  notifyEnterCode(event, helper = this) {
    // console.log("guests:" + event.guestIds);
    // get host
    User.findOne({ userId: event.hostId }, {}, function (err, host) {
      if (err) {
        // res.send(err);
        // console.log(err);
        return;
      }
      // console.log("host is:" + host.userId);
      // send messages to host
      this.notifyHelper(host, `Your meetup verification code is ${event.verifyCode}`,
        "Please have the guests enter this code to verify the meetup!");

      // get the deviceToken of the guests
      for (let i = 0; i < event.guestIds.length; i++) {
        const userId = event.guestIds[parseInt(i, 10)];
        User.findOne({ userId: userId.guestId }, {}, (err, guest) => {
          if (err) {
            // res.send(err);
            // console.log(err);
            return;
          }
          // send messages to guests
          helper.notifyHelper(guest, `${host.username}"s meetup verification code is unlocked`,
            "Please get and enter their code to verify the meetup!");
        });
      }
    });
  }
}

module.exports = helpers;
