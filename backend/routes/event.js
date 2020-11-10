const express = require("express");

const router = new express.Router();
const Event = require("../models/event");
const User = require("../models/user");
const pushNotify = require("../emitter");

// get all events in our db
router.get("/getAll", (req, res) => {
  // console.log("/event GET ALL request");
  Event.find(
    (err, event) => {
      if (err) {
        res.send(err);
        // console.log(err);
      } else {
        res.status(200).json(event);
      }
    },
  );
});

// get all events that the user is in and is not verified in our db
router.post("/getUser", (req, res) => {
  // console.log("/event GET ALL request");
  // console.log(req.body);
  // console.log(req.body[0].userId);
  Event.find( 
    {$and: [
      {$or: [
        { hostId: req.body[0].userId },
        { guestIds: { $elemMatch: {guestId: req.body[0].userId} } }   
      ]},
      {isVerified: false}
  ]},
    
    (err, event) => {
      if (err) {
        res.send(err);
        // console.log(err);
      } else {
        // console.log(event);
        res.status(200).json(event);
      }
    },
  );
});

// get specific events in our db
router.get("/", (req, res) => {
  // console.log("/event GET request");
  Event.findOne({ eventId: req.body.eventId },
    (err, event) => {
      if (err) {
        res.send(err);
        // console.log(err);
      } else {
        // console.log(event);
        res.status(200).json(event);
      }
    });
});

// post an event in our db
router.post("/", (req, res) => {
  // console.log("/event POST request");
  const _ = req.body;

  const event = new Event({
    eventId: `r${_.restId}h${_.hostId}t${_.timeOfMeet}`,
    hostId: _.hostId,
    guestIds: _.guestIds,
    restId: _.restId,
    restName: _.restName,
    timeOfMeet: _.timeOfMeet,
    // optional params which are set automatically
    timeOfCreation: _.timeOfCreation,
    isVerified: _.isVerified,
    verifyCode: _.verifyCode,
  });

  var i;
  for (i = 0; i < event.guestIds.length; i++) {
    if (event.guestIds[i].guestId === event.hostId) {
      res.json({ message: "host cannot create meetup with themselves" });
      return;
    }
  }

  event.save()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      // console.log(err);
      res.json({ message: err });
    });

  pushNotify.emit("newMeetup", event);
});

// delete a specific event in our db
router.delete("/", (req, res) => {
  // console.log("/event DELETE request");

  Event.deleteOne({ eventId: req.body.eventId },
    (err) => {
      if (err) {
        res.send(err);
        // console.log(err);
      } else {
        res.status(200).send("delete successful");
      }
    });
});

// delete a specific event in our db
router.delete("/deleteAll", (req, res) => {
  // console.log("/event DELETE request");

  Event.deleteMany({},
    (err) => {
      if (err) {
        res.send(err);
        // console.log(err);
      } else {
        res.status(200).send("delete all successful");
      }
    });
});

// verify meetup, with error case
router.put("/", (req, res) => {
  // update the meetup to show verified if the codes match, else fail
  Event.findOneAndUpdate(
    { 
      eventId: req.body.eventId, 
      guestIds: { $elemMatch: {guestId: req.body.guestId} },
      verifyCode: req.body.verifyCode, 
      isVerified: false 
    },
    { isVerified: true },
    (err, event) => {
      if (err) {
        res.send(err);
        // console.log(err);
      } else if (event == null) {

        // if we cannot verify the event we send error messages and notifications
        User.findOne(
          { userId: req.body.guestId },
          (err, guest) => {
            if (err) {
              res.send(err);
              // console.log(err);
            } else {
              if (guest == null) {
                res.send("user not in database");
                return;
              }
              res.send("user cannot verify this meetup");
              pushNotify.emit("noVerifyMeetup", guest);
            }
          },
        );

      } else {

        // console.log(req.body.guestId);
        
        User.findOne(
          { userId: event.guestIds[0].guestId },
          (err, guest) => {
            if (err) {
              res.send(err);
              // console.log(err);
            } else {
              if (guest == null) {
                return;
              }
              // console.log(guest);
              pushNotify.emit("verifyMeetup", event, guest);
              res.status(200).send("verify successful");
            }
          },
        );
      }
    },
  );
});

async function contactTraceTrigger(sickUser, atRiskUserId, event) {
  await User.findOne({ userId: atRiskUserId },
    (err, atRiskUser) => {
      if (err) {
        // console.log(err);
        return;
      }
      pushNotify.emit("contactTrace", sickUser, atRiskUser, event);
    });
}

function findAtRiskUsers(req, res, sickUser, pastEvents) {
  const notifiedUserIds = [];
  notifiedUserIds.push(req.body.userId);
  pastEvents.forEach((event) => {
    // console.log("event restid: " + event.restId);
    if (!notifiedUserIds.includes(event.hostId)) {
      // notify host
      // console.log(event.hostId);
      notifiedUserIds.push(event.hostId);
      contactTraceTrigger(sickUser, event.hostId, event);
    }
    // notify guests
    event.guestIds.forEach((atRiskUser) => {
      if (!notifiedUserIds.includes(atRiskUser.guestId)) {
        // console.log(atRiskUser.guestId);
        contactTraceTrigger(sickUser, atRiskUser.guestId, event);
        notifiedUserIds.push(atRiskUser.guestId);
      }
    });
  });
  // console.log(notifiedUserIds);
  if (notifiedUserIds.length > 1) {
    // here we verify that at least one notification has been sent
    // remove sick user from list
    notifiedUserIds.shift();
    pushNotify.emit("finishContactTrace", sickUser, notifiedUserIds.length);
    res.status(200).json({ pastEvents, notifiedUserIds });
  } else {
    // console.log("no events found...");
    pushNotify.emit("finishContactTrace", sickUser, 0);
    res.status(200).send("no at risk meet-ups");
  }
}

// update contact tracing logs
router.post("/contactTrace", (req, res) => {
  // find all verified meetups including the sick user that occured in the past 2 weeks
  // notify in descending date to notify those most at risk first
  // console.log("/event/contactTrace GET request");
  // console.log("sick user:" + req.body.userId);
  // console.log("two weeks ago: " + req.body.twoWeeksAgo);
  // console.log("time now: " + req.body.currentDate);

  Event.find({
    $or: [{ hostId: req.body.userId }, { guestIds: { $elemMatch: { guestId: req.body.userId } } }],
    timeOfMeet: { $gte: req.body.twoWeeksAgo, $lte: req.body.currentDate },
    isVerified: true,
  },
  (err, pastEvents) => {
    if (err) {
      // error case protected here
      res.send(err);
      // console.log(err);
    }

    // console.log(pastEvents);

    User.findOne({ userId: req.body.userId },
      (err, sickUser) => {
        if (err) {
          res.send(err);
          // console.log(err);
          return;
        }
        if (sickUser == null) {
          res.send("error, no user found by userId");
          // console.log("error, no user found by userId");
          return;
        }
        // no meetups verified yet or 14 days since last meet,
        if (pastEvents.length === 0) {
          // console.log("no events found...");
          pushNotify.emit("finishContactTrace", sickUser, 0);
          res.status(200).send("no at risk meet-ups");
          return;
        }
        findAtRiskUsers(req, res, sickUser, pastEvents);
      });
  });
});

module.exports = router;
