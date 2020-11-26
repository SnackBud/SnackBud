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
        res.status(404).send(err);
        // console.log(err);
      } else {
        if (event == null) {
          res.status(204).send(null);
        } else {
          res.status(200).json(event);
        }
      }
    },
  );
});

// get all events that the user is in and is not verified in our db
router.post("/getUser", (req, res) => {
  // console.log("/event GET ALL request");
  // console.log(req.body);
  // console.log(req.body[0].userId);
  if (req.body == null ||
    req.body[0].userId == null) {
    res.status(400).send("bad input");
    return;
  }

  Event.find(
    {
      isVerified: false,
      $or: [
        { hostId: req.body[0].userId },
        {
          guestIds: { $elemMatch: { guestId: req.body[0].userId } },
          notVerified: { $elemMatch: { guestId: req.body[0].userId } }
        }
      ]
    },

    (err, event) => {
      if (err) {
        res.status(404).send(err);
        return;
        // console.log(err);
      } else {
        // console.log(event);
        res.status(200).json(event);
        return;
      }
    },
  );
});

// get specific events in our db
router.get("/", (req, res) => {
  // console.log("/event GET request");
  if (req.body.eventId == null) {
    res.status(400).send("bad input");
    return;
  }

  Event.findOne({ eventId: req.body.eventId },
    (err, event) => {
      if (err) {
        // console.log(err);
        res.status(404).send(err);
        return;
      } else {
        if (event == null) {
          res.status(204).send(null);
          return;
        } else {
          res.status(200).json(event);
          return;
        }
        // console.log(event);
      }
    });
});

function checkParams(req, res) {
  const _ = req.body;
  const nullExists = (_.guestIds == null ||
    _.restId == null ||
    _.timeOfMeet == null);
  if (nullExists) {
    res.status(400).send("bad input");
    return 400;
  }
  return 0;
}

function checkMeetup(event, res) {
  if (event.guestIds.length >= 7) {
    res.status(431).send("Request header field too large");
    return 431;
  }

  for (let i = 0; i < event.guestIds.length; i++) {
    if (event.guestIds[parseInt(i, 10)].guestId === event.hostId) {
      res.status(405).json({ message: "host cannot create meetup with themselves" });
      return 405;
    }
  }
  return 0;
}

// post an event in our db
router.post("/", (req, res) => {
  // console.log("/event POST request");
  const _ = req.body;
  if (!(_)) {
    res.status(400).send("bad input");
    return;
  }
  if (checkParams(req, res)) {
    return;
  }

  console.log(req.body);

  const event = new Event({
    eventId: `r${_.restId}h${_.hostId}t${_.timeOfMeet}`,
    hostId: _.hostId,
    guestIds: _.guestIds,
    restId: _.restId,
    restName: _.restName,
    timeOfMeet: _.timeOfMeet,
    // optional params which are set automatically
    timeOfCreation: _.timeOfCreation,
    notVerified: _.guestIds,
    verifyCode: _.verifyCode,
  });

  if (checkMeetup(event, res)) {
    return;
  }

  event.save().then((data) => {
    res.status(201).json(data);
  }).catch((err) => {
    // console.log(err);
    res.status(502).json({ message: err });
  });

  pushNotify.emit("newMeetup", event);
});

// delete a specific event in our db
router.delete("/", (req, res) => {
  // console.log("/event DELETE request");
  if (req.body.eventId == null) {
    res.status(400).send("bad input");
    return;
  }

  Event.deleteOne({ eventId: req.body.eventId },
    (err, d) => {
      if (err, d) {
        res.status(404).send(err);
        return;
        // console.log(err);
      } else if (d.acknowledged && d.deletedCount === 1) {
        res.status(200).send("delete successful");
        return;
      } else {
        res.status(410).send("already deleted");
        return;
      }
    });
});

// // delete a specific event in our db
router.delete("/deleteAll", (req, res) => {
  // console.log("/event DELETE request");

  Event.deleteMany({},
    (err, d) => {
      if (err) {
        res.status(404).send(err);
        // console.log(err);
      } else if (d.acknowledged && d.deletedCount === 1) {
        res.status(200).send("delete all successful");
      } else {
        res.status(410).send("already deleted all");
      }
    });
});

// verify meetup, with error case
router.put("/", (req, res) => {
  if (req.body.eventId == null ||
    req.body.verifyCode == null ||
    req.body.guestId == null) {
    res.status(400).send("bad input");
    return;
  }


  // update the meetup to show verified if the codes match, else fail
  Event.findOneAndUpdate(
    {
      isVerified: false,
      eventId: req.body.eventId,
      guestIds: { $elemMatch: { guestId: req.body.guestId } },
      verifyCode: req.body.verifyCode,
      notVerified: { $elemMatch: { guestId: req.body.guestId } }
    },
    { notVerified: { $pullAll: { guestId: req.body.guestId } } },
    // returns the updated document
    { new: true },
    (err, event) => {
      if (err) {
        res.status(404).send(err);
        return;
        // console.log(err);
      } else if (event == null) {
        // if we cannot verify the event we send error messages and notifications
        User.findOne(
          { userId: req.body.guestId },
          (err, guest) => {
            if (err) {
              res.status(404).send(err);
              return;
              // console.log(err);
            } else {
              if (guest == null) {
                res.status(410).send("user not in database");
                return;
              }
              res.status(304).send("meetup not modified");
              pushNotify.emit("noVerifyMeetup", guest);
              return;
            }
          },
        );
      } else {

        // if everyone have verified, then change the isVerified status
        // var count = 0;
        // console.log(event.notVerified);
        var count = event.notVerified.filter((x) => x.guestId != null).length;
        // for (var i = 0; i < event.notVerified.length; i++) {
        //   // console.log(event.notVerified[i]);
        //   if (event.notVerified[i].guestId != null) {
        //     // console.log(count);
        //     count++;
        //   }
        // }

        if (count === 0) {
          // console.log("check")
          event.isVerified = true;
          event.save((err) => {
            if (err) {
              // console.log(err);
              return;
            }
            // saved!
          });
        }

        User.findOne(
          { userId: event.guestIds[0].guestId },
          (err, guest) => {
            if (err) {
              res.status(404).send(err);
              // console.log(err);
            } else if (guest == null) {
              res.status(410).send("user not in database");
            } else {
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

async function contactTraceTrigger(res, sickUser, atRiskUserId, event) {
  await User.findOne({ userId: atRiskUserId },
    (err, atRiskUser) => {
      if (err) {
        // console.log(err);
        res.status(404).send();
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
      contactTraceTrigger(res, sickUser, event.hostId, event);
    }
    // notify guests
    event.guestIds.forEach((atRiskUser) => {
      if (!notifiedUserIds.includes(atRiskUser.guestId)) {
        // console.log(atRiskUser.guestId);
        contactTraceTrigger(res, sickUser, atRiskUser.guestId, event);
        notifiedUserIds.push(atRiskUser.guestId);
      }
    });
  });
  // console.log(notifiedUserIds);
  // if (notifiedUserIds.length > 1) {
  // here we verify that at least one notification has been sent
  // remove sick user from list
  notifiedUserIds.shift();
  pushNotify.emit("finishContactTrace", sickUser, notifiedUserIds.length);
  res.status(200).json({ pastEvents, notifiedUserIds });
  // } else {

  // console.log("no events found...");
  // pushNotify.emit("finishContactTrace", sickUser, 0);
  // res.status(200).send("no at risk meet-ups");
  // }
}

// update contact tracing logs
router.post("/contactTrace", (req, res) => {
  // find all verified meetups including the sick user that occured in the past 2 weeks
  // notify in descending date to notify those most at risk first
  // console.log("/event/contactTrace GET request");
  // console.log("sick user:" + req.body.userId);
  // console.log("two weeks ago: " + req.body.twoWeeksAgo);
  // console.log("time now: " + req.body.currentDate);
  if (req.body.userId == null ||
    req.body.twoWeeksAgo == null ||
    req.body.currentDate == null) {
    res.status(400).send("bad input");
  }

  Event.find({
    $or: [{ hostId: req.body.userId }, { guestIds: { $elemMatch: { guestId: req.body.userId } } }],
    timeOfMeet: { $gte: req.body.twoWeeksAgo, $lte: req.body.currentDate },
    notVerified: {},
  },
    (err, pastEvents) => {
      if (err) {
        // error case protected here
        res.status(404).send(err);
        // console.log(err);
      }

      // console.log(pastEvents);

      User.findOne({ userId: req.body.userId },
        (err, sickUser) => {
          if (err) {
            res.status(404).send(err);
            // console.log(err);
            return;
          }
          if (sickUser == null) {
            res.status(410).send("error, no user found by userId");
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
