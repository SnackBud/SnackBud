const express = require('express');

const router = new express.Router();
const User = require('../models/user');

// gets the user specified by req.body.userId in our db
router.get('/', async (req, res) => {
  // console.log('/user GET request');

  User.findOne({ userId: req.body.userId },
    (err, user) => {
      if (err) {
        res.send(err);
        // console.log(err);
      } else {
        res.json(user);
      }
    });
});

// gets all users in our db
router.get('/getAll', async (req, res) => {
  // console.log('/user GETALL request');

  User.find({},
    (err, user) => {
      if (err) {
        res.send(err);
        // console.log(err);
      } else {
        res.json(user);
        // //console.log(user);
      }
    });
});

// posts a user json file to the database
router.post('/', (req, res) => {
  // console.log('/user POST request');
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
        res.send(err);
        // console.log(err);
        // console.log(doc);
      }
      res.json(user);
    });
});

// delete a specific user in our db
router.delete('/', (req, res) => {
  // console.log('/user DELETE request');

  User.deleteOne({ userId: req.body.userId },
    (err) => {
      if (err) {
        res.send(err);
        // console.log(err);
      } else {
        res.send('delete successful');
      }
    });
});

// delete all entries in the user folder
router.delete('/deleteALL', (req, res) => {
  // console.log('/event DELETE request');

  Event.deleteMany({},
    (err) => {
      if (err) {
        res.send(err);
        // console.log(err);
      } else {
        res.send('deleteALL successful');
      }
    });
});

module.exports = router;
