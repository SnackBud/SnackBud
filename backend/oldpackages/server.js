// const express = require('express');
// const MongoClient = require('mongodb').MongoClient;
// const events = require('events');
// const mongoose = require('mongoose');
// require('dotenv/config');


// const route = express.Router()
// //insert middleware before HTTP handlers
// // route.use(express.json());

// //create an object of EventEmitter class from events modules
// const myEmitter = new events.EventEmitter();

// const uri = "mongodb+srv://arnold:ev9sZ7SGHhaqkBB@snackbuddb.diipf.mongodb.net/<dbname>?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   console.log('Connected to MongoDB');
// //   client.close();
// });

// /*

// MongoClient.connect("mongodb+srv://priahi:a1s2d34f@cluster0.37qxf.azure.mongodb.net/priahi?retryWrites=true&w=majority",
//     { useUnifiedTopology: true, useNewUrlParser: true },
//     (err, client) => {
//         db = client.db('list');
//         // var server = app.listen(3000, function () {
//         //     var port = server.address().port;
//         //     console.log("Listening at %s", port);
//         // });
//         if (err) return console.log(err);
//     });

// route.post('/list', (req, res) => {
//     db.collection('list').insertOne(
//         { task: req.body.task, info: req.body.info },
//         (err, request) => {
//             if (err) return console.log(err);
//             res.send('saved');
//         }
//     )
//     res.send(req.body.text); //read json objects in http handlers
// });

// route.get('/list', (req, res) => {
//     db.collection('list')
//         .find()
//         .toArray((err, results) => {
//             res.send(results);
//         });
// });

// route.put('/list', function (req, res) {
//     db.collection('list').updateOne(
//         { task: req.body.task }, { $set: { info: req.body.info } },
//         (err, request) => {
//             if (req.body.task == null || req.body.info == null) {
//                 res.status(400).send("Invalid task or info\n");
//                 return;
//             }
//             if (err) return console.log(err);
//             res.send('updated\n');
//         }
//     );
// });

// route.delete('/list', (req, res) => {
//     db.collection('list').deleteOne(
//         { task: req.body.task },
//         (err, request) => {
//             if (req.body.task == null) {
//                 res.status(400).send("Invalid task or info\n");
//                 return;
//             }
//             if (err) return console.log(err);
//             res.send('removed');
//         }
//     )
//     res.send(req.body.text); //read json objects in http handlers
// });

// route.get('/time', (req, res) => {
//     console.log("we are here 68")
//     let date_ob = new Date(Date.now());
//     let date = date_ob.getDate();
//     let month = date_ob.getMonth() + 1;
//     let year = date_ob.getFullYear();
//     let hours = date_ob.getHours();
//     let minutes = date_ob.getMinutes();
//     let seconds = date_ob.getSeconds();
//     let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
//     let server_time = hours + ":" + minutes + ":" + seconds + ", " + date + "/" + month + "/" + year + " " + timezone;
//     let return_val = "Time on com.priahi.SnackBud is: " + server_time;
//     res.send(return_val);
//     console.log("salam")
// });
// */

// //get all or a specific meetup
// route.get('/meetups/{req.body.userId}/userMeetups', (req, res) => {
//     if (req.body.getAll == true) {
//         db.collection('userMeetups')
//             .toArray((err, results) => {
//                 res.send(results);
//             });
//     } else {
//         db.collection('userMeetups')
//             .findOne({ meetId: req.body.meetId })
//             .toArray((err, results) => {
//                 res.send(results);
//             });
//     }
// });

// // create a meet up
// route.post('/meetup', (req, res) => {
//     db.collection('meetup/{req.body.hostId}/userMeetups').insertOne(
//         {
//             hostId: req.body.hostId,
//             guestId: req.body.guestId,
//             restId: req.body.restId,
//             meetId: req.body.meetId,
//             timeOfMeet: req.body.timeOfMeet,
//             timeOfCreation: req.body.timeOfCreation,
//             isVerified: req.body.isVerified,
//             verifyCode: req.body.vcode
//         },
//         (err, request) => {
//             if (err) return console.log(err);
//             res.send('meet up created for host');
//         }
//     );
//     db.collection('meetup/{req.body.guestId}/userMeetups').insertOne(
//         {
//             hostId: req.body.hostId,
//             guestId: req.body.guestId,
//             restId: req.body.restId,
//             meetId: req.body.meetId,
//             timeOfMeet: req.body.timeOfMeet,
//             timeOfCreation: req.body.timeOfCreation,
//             isVerified: req.body.isVerified,
//             verifyCode: req.body.vcode
//         },
//         (err, request) => {
//             if (err) return console.log(err);
//             res.send('meet up created for guest');
//         }
//     );
//     //trigger to create notif 
//     myEmitter.emit('meetCreate', (req.body.guestId, req.body.meetId));
//     res.send(req.body.text); //read json objects in http handlers
// });

// // get verify code
// route.get('/meetups/{req.body.userId}/userMeetups', (req, res) => {
//     let meetup = db.collection('userMeetups')
//         .findOne({ meetId: req.body.meetId })
//         .toArray((err, results) => {
//             res.send(results.body.verifyCode);
//         });
//     myEmitter.emit('meetCreate', (meetup.guestId, meetup.meetId));
// });

// // verify meetup
// route.put('/meetups', function (req, res) {
//     if (req.body.isVerified == true) {
//         db.collection('/meetups/{req.body.hostId}/userMeetups').updateOne(
//             {meetId: req.body.meetId},
//             { $set: { isVerified: req.body.isVerified } },
//             (err, request) => {
//                 if (req.body.task == null || req.body.info == null) {
//                     res.status(400).send("Invalid task or info\n");
//                     return;
//                 }
//                 if (err) return console.log(err);
//                 res.send('verified host\n');
//             }
//         );
//         db.collection('/meetups/{req.body.guestId}/userMeetups').updateOne(
//             {meetId: req.body.meetId},
//             { $set: { isVerified: req.body.isVerified } },
//             (err, request) => {
//                 if (req.body.task == null || req.body.info == null) {
//                     res.status(400).send("Invalid task or info\n");
//                     return;
//                 }
//                 if (err) return console.log(err);
//                 res.send('verified guest\n');
//             }
//         );
//         myEmitter.emit('meetVerify', (req.body.hostId, req.body.meetId));
//     }
// });

// // register userId and device notification tokens
// route.put('/register', function (req, res) {
//     db.collection('/tokens').updateOne(
//         { userId: req.body.userId }, { $set: { token: req.body.token } }, { upsert: true },
//         (err, request) => {
//             if (req.body.token == null || req.body.userId == null) {
//                 res.status(400).send("Invalid userId or registration token\n");
//                 return;
//             }
//             if (err) return console.log(err);
//             res.send('token added\n');
//         }
//     );
// });

// //fcm sdk
// var admin = require("firebase-admin")

// //initialize firebase admin
// //run the following to set env var:
// // (Windows)
// // $env:GOOGLE_APPLICATION_CREDENTIALS="./service-account-file.json"
// // (Linux/MacOS)
// // export GOOGLE_APPLICATION_CREDENTIALS="./service-account-file.json"
// admin.initializeApp({
//     credential: admin.credential.applicationDefault(),
// });

// //listener for guests when a meetup is created with them included
// myEmitter.on('meetCreate', function (guestId, meetId) {
//     console.log('Create meet for: ' + guestId);
//     //this gives the meetup
//     db.collection('meetup/{guestId}/userMeetups').findOne({ meetId: meetId });
//     //this gets the user to notify
//     var guestId = db.collection('users/{guestId}');
//     // send notif here
//     var registrationToken = db.collection('/tokens').findOne({ userId: guestId });
//     var message = {
//         notification: {
//           title: 'You are invited to a new meetup!',
//           body: ':)'
//         },
//         token: registrationToken
//     };
//     admin.messaging().send(message)
//     .then((response) => {
//     // Response is a message ID string.
//     console.log('Successfully sent message:', response);
//     })
//     .catch((error) => {
//     console.log('Error sending message:', error);
//     });
// });

// //listener for guests when the host unlocks the verification code
// myEmitter.once('enterCode', function (guestId, meetId) {
//     console.log('Code is now available to: ' + guestId);
//     //this gives the meetup
//     db.collection('meetup/{guestId}/userMeetups').findOne({ meetId: meetId });
//     //this gets the user to notify
//     db.collection('users/{guestId}')
//     // send notif here
//     var registrationToken = db.collection('/tokens').findOne({ userId: guestId });
//     var message = {
//         notification: {
//           title: 'The host has unlocked the verification code!',
//           body: ':)'
//         },
//         token: registrationToken
//     };
//     admin.messaging().send(message)
//     .then((response) => {
//     // Response is a message ID string.
//     console.log('Successfully sent message:', response);
//     })
//     .catch((error) => {
//     console.log('Error sending message:', error);
//     });
// });

// //listener for the host to see if the meetup has been verified
// myEmitter.on('meetVerify', function (Event event) {
//     console.log('Verify meet for: ' + hosttId);
//     //this gives the meetup
//     db.collection('meetup/{hostId}/userMeetups').findOne({ meetId: meetId });
//     //this gets the user to notify
//     db.collection('users/{hostId}')
//     // send notif here
//     var registrationToken = db.collection('/tokens').findOne({ userId: hostId });
//     var message = {
//         notification: {
//           title: 'The meet up has been verified',
//           body: ':)'
//         },
//         token: registrationToken
//     };
//     admin.messaging().send(message)
//     .then((response) => {
//     // Response is a message ID string.
//     console.log('Successfully sent message:', response);
//     })
//     .catch((error) => {
//     console.log('Error sending message:', error);
//     });
// });

// //error handling
// myEmitter.on('error', (err) => {
//     console.error('whoops! there was an error bro!' + err);
// });


// // // only triggerable once
// // let triggered = 0;
// // myEmitter.once('event', () => {
// //     console.log(++triggered);
// //     myEmitter.emit('error', new Error('whoops!'));
// // });
// // myEmitter.emit('event');
// // // Prints: 1
// // myEmitter.emit('event');
// // // Ignored


// module.exports = route
