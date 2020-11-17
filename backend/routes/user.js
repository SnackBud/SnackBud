const express = require("express");

const router = new express.Router();
const User = require("../models/user");

// gets the user specified by req.body.userId in our db
router.get("/", async (req, res) => {
  // console.log("/user GET request");
  if (req.body.userId == null) {
    res.status(400).send("bad input")
  }

  User.findOne({ userId: req.body.userId },
    (err, user) => {
      if (err) {
        res.status(404).send(err);
        // console.log(err);
      } else {
        if (user == null) {
          res.status(204).json(user);
        } else {
          res.status(200).json(user);
        }
      }
    });
});

// gets all users in our db
router.get("/getAll", async (req, res) => {
  // console.log("/user GETALL request");

  User.find({},
    (err, users) => {
      if (err) {
        res.status(404).send(err);
        // console.log(err);
      } else {
        if (users == null) {
          res.status(204).json(users);
        } else {
          res.status(200).json(users);
        }
        // //console.log(user);
      }
    });
});

// posts a user json file to the database
router.post("/", (req, res) => {
  // console.log("/user POST request");
  if (req.body.userId == null || 
    req.body.username == null || 
    req.body.deviceToken == null || 
    req.body.date == null) {
      res.status(400).send("bad input")
    }

  const user = new User({
    userId: req.body.userId,
    username: req.body.username,
    deviceToken: req.body.deviceToken,
    date: req.body.date,
  });

  // console.log(user);

  User.updateOne({ userId: user.userId },
    { $set: { username: user.username, deviceToken: user.deviceToken, date: user.date } },
    { upsert: true },
    (err, doc) => {
      if (err) {
        res.status(404).send(err);
        // console.log(err);
        // console.log(doc);
      }
      res.status(201).json(user);
    });
});

// delete a specific user in our db
router.delete("/", (req, res) => {
  // console.log("/user DELETE request");
  if (req.body.userId == null) {
    res.status(400).send("bad input")
  }

  User.deleteOne({ userId: req.body.userId },
    (err, d) => {
      if (err) {
        res.send(err);
        // console.log(err);
      } else if (d.acknowledged && d.deletedCount == 1)
        res.status(200).send("delete successful");
      else
        res.status(410).send("already deleted");
    });
});

// delete all entries in the user folder
// router.delete("/deleteALL", (req, res) => {
//   // console.log("/event DELETE request");

//   Event.deleteMany({},
//     (err, d) => {
//       if (err) {
//         res.send(err);
//         // console.log(err);
//       } else if (d.acknowledged && d.deletedCount == 1)
//         res.status(200).send("delete all successful");
//       else
//         res.status(410).send("already deleted all");
//     });
// });

module.exports = router;
