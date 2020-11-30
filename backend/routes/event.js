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
router.post("/toVerify", (req, res) => {
  // console.log(req.body);
  // console.log(req.body[0].userId);
  if (req.body == null ||
    req.body[0] == null ||
    req.body[0].userId == null) {
    res.status(400).json("bad input");
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

    (err, events) => {
      if (err) {
        // console.log(err);
        res.status(404).send(err);
        return;
      } else {
        res.status(200).json(events);
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

// function checkParams(req, res) {
//   const _ = req.body;
//   const nullExists = (_.guestIds == null ||
//     _.restId == null ||
//     _.timeOfMeet == null);
//   if (nullExists) {
//     res.status(400).json("bad input");
//     return 400;
//   }
//   return 0;
// }

function checkMeetup(event, res) {
  if (event.guestIds.length >= 7) {
    res.status(431).json("Request header field too large");
    return 431;
  }

  for (let i = 0; i < event.guestIds.length; i++) {
    if (event.guestIds[parseInt(i, 10)].guestId === event.hostId) {
      res.status(405).json("host cannot create meetup with themselves");
      return 405;
    }
  }
  return 0;
}

// post an event in our db
router.post("/", (req, res) => {
  // console.log("/event POST request");
  const _ = req.body;
  var badInput = _ == null || _.guestIds == null || _.restId == null || _.timeOfMeet == null;
  if (badInput) {
    res.status(400).json("bad input");
    return;
  } 
  const event = new Event({
    hostId: _.hostId,
    guestIds: _.guestIds,
    restId: _.restId,
    restName: _.restName,
    timeOfMeet: _.timeOfMeet,
    eventId: `r${_.restId}h${_.hostId}t${_.timeOfMeet}`,
    // optional params which are set automatically
    timeOfCreation: _.timeOfCreation,
    notVerified: _.guestIds,
    verifyCode: _.verifyCode,
  });

  if (checkMeetup(event, res)) {
    return;
  }

  event.save(function(err) {
    if (err) {
      res.status(502).send(err);
      return;
    } else {
      res.status(200).json(event);
      return;
    }
  });

  // helper.notifyNewMeetup(event);
  pushNotify.emit("newMeetup", event);

});

// delete a specific event in our db
router.delete("/", (req, res) => {
  // console.log("/event DELETE request");
  if (req.body.eventId == null) {
    res.status(400).json("bad input");
    return;
  }

  Event.deleteOne({ eventId: req.body.eventId },
    (err, d) => {
      if (err) {
        res.status(404).send(err);
        return;
        // console.log(err);
      // } else if (d.acknowledged && d.deletedCount === 1) {
      //   res.status(200).send("delete successful");
      //   return;
      } else {
        res.status(200).json("delete successful");
        return;
      }
    });
});

// verify meetup, with error case
router.put("/verify", (req, res) => {
  if (req.body == null || 
    req.body.eventId == null ||
    req.body.verifyCode == null ||
    req.body.guestId == null) {
    res.status(400).json("bad input");
    return;
  }


  // update the meetup to show verified if the codes match, else fail
  Event.findOne(
    {
      isVerified: false,
      eventId: req.body.eventId,
      guestIds: { $elemMatch: { guestId: req.body.guestId } },
      verifyCode: req.body.verifyCode,
      notVerified: { $elemMatch: { guestId: req.body.guestId } }
    },
    // // returns the updated document
    // { new: true },
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
                res.status(410).json("user not in database");
                return;
              } else {
                pushNotify.emit("noVerifyMeetup", guest);
                res.status(304).json("meetup not modified");
                return;
              }
            }
          },
        );
      } else {

        // if the user successfully verifies, we remove them from the notVerified array

        for (var i = 0; i < event.notVerified.length; i++) {
          if (event.notVerified[parseInt(i, 10)].guestId === req.body.guestId) {
            event.notVerified[parseInt(i, 10)].guestId = null;
          }
        }

        // if everyones verified, set isVerified to true in event
        var count = event.notVerified.filter((x) => x.guestId != null).length;
        if (count === 0) {
          event.isVerified = true;
        }

        var savingError = false;
        Event.findOneAndUpdate({
            _id: event._id
          }, 
          event, 
          { upsert: true }, 
          function(err, event) {
            if (err) {
              res.status(404).send(err);
              savingError = true;
              return;
            }
        });

        if (savingError) {
          return;
        }

        User.findOne(
          { userId: req.body.guestId },
          (err, guest) => {
            if (err) {
              res.status(404).send(err);
              return;
              // console.log(err);
            } else if (guest == null) {
              res.status(410).json("user not in database");
              return;
            } else {
              // console.log(guest);
              res.status(200).json("verify successful");
              pushNotify.emit("verifyMeetup", event, guest);
              return;
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
      // if (err) {
      //   res.status(404).send();
      //   return;
      // }
      pushNotify.emit("contactTrace", sickUser, atRiskUser, event);
    });
}

function findAtRiskUsers(req, res, sickUser, pastEvents) {
  const notifiedUserIds = [];
  notifiedUserIds.push(req.body.userId);
  pastEvents.forEach((event) => {
    if (!notifiedUserIds.includes(event.hostId)) {
      // notify host
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
  // here we verify that at least one notification has been sent
  // remove sick user from list
  notifiedUserIds.shift();
  pushNotify.emit("finishContactTrace", sickUser, notifiedUserIds.length);
  res.status(200).json({ pastEvents, notifiedUserIds });
}

// update contact tracing logs
router.post("/contactTrace", (req, res) => {
  // find all verified meetups including the sick user that occured in the past 2 weeks
  // notify in descending date to notify those most at risk first
  if (req.body == null || 
    req.body.userId == null ||
    req.body.twoWeeksAgo == null ||
    req.body.currentDate == null) {
    res.status(400).json("bad input");
    return;
  }

  Event.find({
    timeOfMeet: { $gte: req.body.twoWeeksAgo, $lte: req.body.currentDate },
    $or: [{ 
            hostId: req.body.userId 
          }, 
          { 
            guestIds: { guestId: req.body.userId },
            $not: { notVerified: { $elemMatch: { guestId: req.body.userId } } } 
          }
    ]
  },
    (err, pastEvents) => {
      if (err) {
        // error case protected here
        res.status(404).send(err);
        return;
      }

      User.findOne({ userId: req.body.userId },
        (err, sickUser) => {
          if (err) {
            res.status(404).send(err);
            return;
          } else if (sickUser == null) {
            res.status(410).send("error, no user found by userId");
            return;
          } else if (pastEvents.length === 0) { // no meetups verified yet or 14 days since last meet,
            pushNotify.emit("finishContactTrace", sickUser, 0);
            res.status(200).send("no at risk meet-ups");
            return;
          } else {
            findAtRiskUsers(req, res, sickUser, pastEvents);
          }
        });
    });
});
// delete a specific event in our db
// router.delete("/deleteAll", (req, res) => {
//   // console.log("/event DELETE request");

//   Event.deleteMany({},
//     (err, d) => {
//       if (err) {
//         res.status(404).send(err);
//         // console.log(err);
//       // } else if (d.acknowledged && d.deletedCount === 1) {
//       //   res.status(200).send("delete all successful");
//       } else {
//         res.status(200).send("delete all successful");
//       }
//     });
// });

module.exports = router;
