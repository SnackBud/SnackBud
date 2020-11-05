const express = require('express');
const router = new express.Router();
const Event = require('../models/event');
const User = require('../models/user');
const pushNotify = require('../emitter');

// get all events in our db
router.get('/getAll', (req, res) => {
    console.log('/event GET ALL request');
    Event.find(
        function (err, event) {
            if (err) {
                res.send(err);
                console.log(err);
            } else {
                res.status(200).json(event);
            }
        });
});

// get specific events in our db
router.get('/', (req, res) => {
    console.log('/event GET request');
    Event.findOne({ 'eventId': req.body.eventId },
        function (err, event) {
            if (err) {
                res.send(err);
                console.log(err);
            } else {
                res.status(200).json(event);
            }
        });
});

// post an event in our db
router.post('/', (req, res) => {
    console.log('/event POST request');
    let _ = req.body;

    const event = new Event({
        eventId: "r" + _.restId + "h" + _.hostId + "t" + _.timeOfMeet,
        hostId: _.hostId,
        guestIds: _.guestIds,
        restId: _.restId,
        restName: _.restName,
        timeOfMeet: _.timeOfMeet,
        // optional params which are set automatically
        timeOfCreation: _.timeOfCreation,
        isVerified: _.isVerified,
        verifyCode: _.verifyCode
    });

    event.save()
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            console.log(err);
            res.json({ message: err });
        });

    pushNotify.emit('newMeetup', event);
});

// delete a specific event in our db
router.delete('/', (req, res) => {
    console.log('/event DELETE request');

    Event.deleteOne({ eventId: req.body.eventId },
        function (err) {
            if (err) {
                res.send(err);
                console.log(err);
            } else {
                res.status(200).send("delete successful");
            }
        });
});

// delete a specific event in our db
router.delete('/deleteAll', (req, res) => {
    console.log('/event DELETE request');

    Event.deleteMany({},
        function (err) {
            if (err) {
                res.send(err);
                console.log(err);
            } else {
                res.status(200).send("delete all successful");
            }
        });
});

// verify meetup, with error case
router.put('/', function (req, res) {
    // update the meetup to show verified if the codes match, else fail
    Event.findOneAndUpdate(
        { eventId: req.body.eventId, verifyCode: req.body.verifyCode },
        { isVerified: true },
        function (err, event) {
            if (err) {
                res.send(err);
                console.log(err);
            } else {
                User.findOne(
                    { 'userId': req.body.guestId },
                    function (err, guest) {
                        if (err) {
                            res.send(err);
                            console.log(err);
                        } else {
                            pushNotify.emit('verifyMeetup', event, guest);
                            res.status(200).send("verify successful");
                        }
                    });
            }
        });
});

async function contactTraceTrigger(sickUser, atRiskUserId, event) {
    await User.findOne({ userId: atRiskUserId },
        function (err, atRiskUser) {
            if (err) {
                console.log(err);
                return;
            }
            pushNotify.emit('contactTrace', sickUser, atRiskUser, event);
        });
}

function findAtRiskUsers(req, res, sickUser, pastEvents) {
    let notifiedUserIds = [];
    notifiedUserIds.push(req.body.userId);
    pastEvents.forEach((event) => {
        console.log("event restid: " + event.restId);
        if (!notifiedUserIds.includes(event.hostId)) {
            //notify host
            console.log(event.hostId);
            notifiedUserIds.push(event.hostId);
            contactTraceTrigger(sickUser, event.hostId, event);
        }
        //notify guests
        event.guestIds.forEach((atRiskUser) => {
            if (!notifiedUserIds.includes(atRiskUser.guestId)) {
                console.log(atRiskUser.guestId);
                contactTraceTrigger(sickUser, atRiskUser.guestId, event);
                notifiedUserIds.push(atRiskUser.guestId);
            }
        });
    });
    console.log(notifiedUserIds);
    if (notifiedUserIds.length > 1) {
        // here we verify that at least one notification has been sent
        // remove sick user from list
        notifiedUserIds.shift();
        pushNotify.emit('finishContactTrace', sickUser, notifiedUserIds.length);
        res.status(200).json({ pastEvents, notifiedUserIds });
    } else {
        console.log("no events found...");
        pushNotify.emit('finishContactTrace', sickUser, 0);
        res.status(200).send("no at risk meet-ups");
        return;
    }
}

// update contact tracing logs
router.post('/contactTrace', function (req, res) {
    // find all verified meetups including the sick user that occured in the past 2 weeks
    // notify in descending date to notify those most at risk first
    console.log('/event/contactTrace GET request');
    console.log('sick user:' + req.body.userId);
    console.log('two weeks ago: ' + req.body.twoWeeksAgo);
    console.log('time now: ' + req.body.currentDate);

    Event.find({
        $or: [{ 'hostId': req.body.userId }, { 'guestIds': { $elemMatch: { 'guestId': req.body.userId } } }],
        'timeOfMeet': { $gte: req.body.twoWeeksAgo, $lte: req.body.currentDate },
        'isVerified': true
    },
        function (err, pastEvents) {
            if (err) {
                // error case protected here
                res.send(err);
                console.log(err);
            }

            console.log(pastEvents);

            User.findOne({ 'userId': req.body.userId },
                function (err, sickUser) {
                    if (err) {
                        res.send(err);
                        console.log(err);
                        return;
                    }
                    if (sickUser == null) {
                        res.send("error, no user found by userId");
                        console.log("error, no user found by userId");
                        return;
                    }
                    // no meetups verified yet or 14 days since last meet, 
                    if (pastEvents.length === 0) {
                        console.log("no events found...");
                        pushNotify.emit('finishContactTrace', sickUser, 0);
                        res.status(200).send("no at risk meet-ups");
                        return;
                    }
                    findAtRiskUsers(req, res, sickUser, pastEvents);
                });
        });

});



module.exports = router;