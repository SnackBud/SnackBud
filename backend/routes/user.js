const express = require("express");

const router = new express.Router();
const User = require("../models/user");

// gets the user specified by req.body.userId in our db
router.get("/", async (req, res) => {
  // console.log("/user GET request");
  if (req.body == null || req.body.userId == null) {
    res.status(400).json("bad input");
    return;
  }

  User.findOne({ userId: req.body.userId },
    (err, user) => {
      if (err) {
        res.status(404).send(err);
        return;
      } else {
        if (user == null) {
          res.status(204).json(user);
          return;
        } else {
          res.status(200).json(user);
          return;
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
        return;
        // console.log(err);
      } else {
        if (users == null) {
          res.status(204).json(users);
          return;
        } else {
          res.status(200).json(users);
          return;
        }
        //console.log(user);
      }
    });
});

// posts a user json file to the database
router.post("/", (req, res) => {
  // console.log(req.body);

  if (req.body == null ||
    req.body.userId == null ||  
    req.body.deviceToken == null) {
      res.status(400).json("bad input");
      return;
    }


  const user = new User({
    userId: req.body.userId,
    username: req.body.username,
    deviceToken: req.body.deviceToken,
  });


  User.updateOne({ userId: user.userId },
    { $set: { username: user.username, deviceToken: user.deviceToken, date: user.date } },
    { upsert: true },
    (err, doc) => {
      if (err) {
        res.status(404).send(err);
        return;
        // console.log(err);
        // console.log(doc);
      }
      res.status(200).json(user);
      return;
    });
});

// delete a specific user in our db
router.delete("/", (req, res) => {
  // console.log("/user DELETE request");
  if (req.body.userId == null) {
    res.status(400).json("bad input");
    return;
  }

  User.deleteOne({ userId: req.body.userId },
    (err, d) => {
      if (err) {
        res.status(404).send(err);
        return;
        // console.log(err);
      // } else if (d.acknowledged && d.deletedCount === 1){
      //   res.status(200).send("delete successful");
      //   return;
      } else {
        res.status(200).json("delete successful");
        return;
      }
    });
});

module.exports = router;
