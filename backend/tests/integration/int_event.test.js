const express = require("express"); // import express
const request = require("supertest"); // supertest is a framework that allows to easily test web apis

const userRoute = require("../routes/user.js");
const eventRoute = require("../routes/event.js");

const app = express(); //an instance of an express app, a 'fake' express app
app.use("/event", eventRoute);
const Event = require("../models/event");

describe("testing-event-routes", () => {
    beforeAll(() => {
        // Event.findOne = jest.fn().mockResolvedValue([{
        //     timeOfCreation: 1605009601688,
        //     isVerified: true,
        //     verifyCode: "436",
        //     eventId: "r1000h105664700188784427014t1605787405385",
        //     hostId: "105664700188784427014",
        //     guestIds: [
        //         {
        //             guestId: "109786710572605387609"
        //         }
        //     ],
        //     restId: "1000",
        //     restName: "Loafe Cafe",
        //     timeOfMeet: 1605787405385,
        // },
        // ]);

        // Event.find = jest.fn().mockResolvedValue([{
        //     username: "Arnold Ying",
        //     userId: "109786710572605387609",
        //     deviceToken: "x"
        // },
        // {
        //     username: "Parsa Riahi",
        //     userId: "114967596096028525632",
        //     deviceToken: "y"
        // }
        // ]);
    });

    it("GET / - success", async () => {
        const { body } = await request(app).get("/");
        expect(body).toEqual("home");
        expect(body.statusCode).toEqual(200);
    });

    it("GET /event - success", async () => {
        Event.findOne = jest.fn().mockResolvedValue([{
            timeOfCreation: 1605009601688,
            isVerified: true,
            verifyCode: "123",
            eventId: "r3h1t1605787405385",
            hostId: "1",
            guestIds: [
                {
                    guestId: "2"
                }
            ],
            restId: "3",
            restName: "Loafe Cafe",
            timeOfMeet: 1605787405385
        },
        ]);
        const { body } = await request(app).get("/event",
            { eventId: "r3h1t1605787405385" });
        expect(body).toEqual([{
            timeOfCreation: 1605009601688,
            isVerified: true,
            verifyCode: "123",
            eventId: "r3h1t1605787405385",
            hostId: "1",
            guestIds: [
                {
                    guestId: "2"
                }
            ],
            restId: "3",
            restName: "Loafe Cafe",
            timeOfMeet: 1605787405385
        }]);
        // expect(body.statusCode).toEqual(200);
    });

    it("GET /event - success no entry by that id", async () => {
        const { body } = await request(app).get("/event",
            { eventId: "r3" });
        expect(body).toEqual(null);
        expect(body.statusCode).toEqual(204);
    });

    it("GET /event - fail null id", async () => {
        const { body } = await request(app).get("/event");
        expect(body.statusCode).toEqual(400);
    });

    it("GET /event/getAll - success", async () => {
        const events = [{
            timeOfCreation: 1605009601688,
            isVerified: true,
            verifyCode: "123",
            eventId: "r3h1t1605787405385",
            hostId: "1",
            guestIds: [
                {
                    guestId: "2"
                }
            ],
            restId: "3",
            restName: "Loafe Cafe",
            timeOfMeet: 1605787405385
        },
        {
            timeOfCreation: 1605009601689,
            isVerified: false,
            verifyCode: "124",
            eventId: "r4h2t1605787405386",
            hostId: "2",
            guestIds: [
                {
                    guestId: "3"
                }
            ],
            restId: "4",
            restName: "Tim Hortons",
            timeOfMeet: 1605787405386
        }
        ];
        Event.find = jest.fn().mockResolvedValue(events);
        const { body } = await request(app).get("/event/getAll");
        expect(body).toEqual(events);
        expect(body.statusCode).toEqual(200);
    });

    it("POST /event/getUser - success", async () => {
        const events = [{
            timeOfCreation: 1605009601688,
            isVerified: false,
            verifyCode: "123",
            eventId: "r3h1t1605787405385",
            hostId: "1",
            guestIds: [
                {
                    guestId: "2"
                }
            ],
            restId: "3",
            restName: "Loafe Cafe",
            timeOfMeet: 1605787405385
        },
        {
            timeOfCreation: 1605009601689,
            isVerified: false,
            verifyCode: "124",
            eventId: "r4h2t1605787405386",
            hostId: "2",
            guestIds: [
                {
                    guestId: "3"
                }
            ],
            restId: "4",
            restName: "Tim Hortons",
            timeOfMeet: 1605787405386
        }
        ];

        Event.find = jest.fn().mockResolvedValue(events);
        const { body } = await request(app).post("/event/getUser",
            { userId: "2" });
        expect(body).toEqual(events);
        expect(body.statusCode).toEqual(200);
    });

    it("GET /event/getUser - fail null id", async () => {
        const { body } = await request(app).post("/event/getUser");
        expect(body.statusCode).toEqual(400);
    });

    it("POST /event - fail null id", async () => {
        const { body } = await request(app).post("/event");
        expect(body).toEqual("bad input");
        expect(body.statusCode).toEqual(400);
    });

    it("POST /event - fail create meet with oneself", async () => {
        const event = [{
            hostId: "1",
            guestIds: [
                {
                    guestId: "2",
                    guestId: "1",
                    guestId: "3",
                }
            ],
            restId: "3",
            restName: "Loafe Cafe",
            timeOfMeet: 1605787405385
        }];
        const { body } = await request(app).post("/event", event);
        expect(body).toEqual({ message: "host cannot create meetup with themselves" });
        expect(body.statusCode).toEqual(405);
    });

    it("POST /event - fail too many guests", async () => {
        const event = [{
            hostId: "1",
            guestIds: [
                {
                    guestId: "2",
                    guestId: "1",
                    guestId: "3",
                    guestId: "4",
                    guestId: "5",
                    guestId: "6",
                    guestId: "7",
                }
            ],
            restId: "3",
            restName: "Loafe Cafe",
            timeOfMeet: 1605787405385
        }];
        const { body } = await request(app).post("/event", event);
        expect(body).toEqual("Request header field too large");
        expect(body.statusCode).toEqual(431);
    });

    it("POST & DELETE /event - success", async () => {
        const event = [{
            eventId: "r3h1t1605787405385",
            hostId: "1",
            guestIds: [
                {
                    guestId: "2",
                    guestId: "3",
                }
            ],
            restId: "3",
            restName: "Loafe Cafe",
            timeOfMeet: 1605787405385
        }];
        let { body1 } = await request(app).post("/event", event);
        expect(body1).toEqual(event);
        expect(body1.statusCode).toEqual(201);

        //DELETE ONCE
        let { body2 } = await request(app).delete("/event", event); //uses the request function that calls on express app instance
        expect(body2).toEqual("delete successful");
        expect(body2.statusCode).toEqual(200);

        //Check for missing resource
        let { body3 } = await request(app).get("/event", event); //uses the request function that calls on express app instance
        expect(body3.statusCode).toEqual(204);

        //SHOULD BE DELETED, GET ERROR CASE OF DOUBLE DELETE
        let { body4 } = await request(app).delete("/event", event); //uses the request function that calls on express app instance
        expect(body4).toEqual("already deleted");
        expect(body4.statusCode).toEqual(410);
    });

    it("DELETE /event - fail null id", async () => {
        const { body } = await request(app).delete("/event");
        expect(body).toEqual("bad input");
        expect(body.statusCode).toEqual(400);
    });

    it("PUT /event - fail, already verified meetup", async () => {
        const event = [{
            timeOfCreation: 1605009601688,
            isVerified: true,
            verifyCode: "436",
            eventId: "r1000h105664700188784427014t1605787405385",
            hostId: "105664700188784427014",
            guestIds: [
                {
                    guestId: "109786710572605387609"
                }
            ],
            restId: "1000",
            restName: "Loafe Cafe",
            timeOfMeet: 1605787405385,
            guestId: "109786710572605387609"
        },
        ];
        const { body } = await request(app).put("/event", event);
        expect(body).toEqual("meetup not modified");
        expect(body.statusCode).toEqual(304);
    });

    it("POST & PUT /event - fail, not a real guest user", async () => {
        const event = [{
            eventId: "r3h1t1605787405385",
            hostId: "1",
            guestIds: [
                {
                    guestId: "2",
                    guestId: "3",
                }
            ],
            restId: "3",
            restName: "Loafe Cafe",
            timeOfMeet: 1605787405385,
            verifyCode: "111",
            isVerified: false,
            guestId: "3",

        }];
        let { body } = await request(app).post("/event", event);
        expect(body).toEqual(event);
        expect(body.statusCode).toEqual(201);

        //VERIFY MEETUP for first time, but wrong user
        let { body2 } = await request(app).put("/event", event);
        expect(body2).toEqual("user not in database");
        expect(body2.statusCode).toEqual(410);
        //Meetup already verified, but wrong user
        let { body3 } = await request(app).put("/event", event);
        expect(body3).toEqual("user not in database");
        expect(body3.statusCode).toEqual(410);

        //DELETE ONCE CREATED
        let { body4 } = await request(app).delete("/event", event); //uses the request function that calls on express app instance
        expect(body4).toEqual("delete successful");
        expect(body4.statusCode).toEqual(200);
    });

    it("POST & PUT & DELETE /event - success", async () => {
        const event = [{
            timeOfCreation: 1605009601688,
            isVerified: false,
            verifyCode: "436",
            eventId: "r1000h105664700188784427014t1605787405390",
            hostId: "105664700188784427014",
            guestIds: [
                {
                    guestId: "109786710572605387609"
                }
            ],
            restId: "1000",
            restName: "Loafe Cafe",
            timeOfMeet: 1605787405390,
            guestId: "109786710572605387609"
        },
        ];
        let { body } = await request(app).post("/event", event);
        expect(body).toEqual(event);
        expect(body.statusCode).toEqual(201);

        //VERIFY MEETUP, but wrong user
        let { body2 } = await request(app).put("/event", event);
        expect(body2).toEqual("verify successful");
        expect(body2.statusCode).toEqual(200);

        //DELETE ONCE VERIFED
        let { body3 } = await request(app).delete("/event", event); //uses the request function that calls on express app instance
        expect(body3).toEqual("delete successful");
        expect(body3.statusCode).toEqual(200);
    });


    it("POST /event/contactTrace - fail null id", async () => {
        const { body } = await request(app).post("/event/contactTrace");
        expect(body).toEqual("bad input");
        expect(body.statusCode).toEqual(400);
    });

    it("POST /event/contactTrace - success with no meetups", async () => {
        const info = [{
            twoWeeksAgo: 1605009501688,
            timeOfMeet: 1605787406390,
            hostId: "105664700188784427014",
        }]
        const events = [{
            timeOfCreation: 1605009601688,
            isVerified: false,
            verifyCode: "436",
            eventId: "r1000h105664700188784427014t1605787405390",
            hostId: "105664700188784427014",
            guestIds: [
                {
                    guestId: "109786710572605387609"
                }
            ],
            restId: "1000",
            restName: "Loafe Cafe",
            timeOfMeet: 1605787405390,
        }];
        Event.find = jest.fn().mockResolvedValue(events);
        const { body } = await request(app).post("/event/contactTrace", info);
        expect(body).toEqual("no at risk meet-ups");
        expect(body.statusCode).toEqual(200);
    });

    it("POST /event/contactTrace - success with reports", async () => {
        const info = [{
            twoWeeksAgo: 1605009501688,
            timeOfMeet: 1605787406390,
            hostId: "105664700188784427014",
        }]
        const events = [{
            timeOfCreation: 1605009601688,
            isVerified: true,
            verifyCode: "436",
            eventId: "r1000h105664700188784427014t1605787405390",
            hostId: "105664700188784427014",
            guestIds: [
                {
                    guestId: "109786710572605387609"
                }
            ],
            restId: "1000",
            restName: "Loafe Cafe",
            timeOfMeet: 1605787405390,
        },
        {
            timeOfCreation: 1605009601683,
            isVerified: true,
            verifyCode: "436",
            eventId: "r1000h109786710572605387609t1605787405390",
            hostId: "109786710572605387609",
            guestIds: [
                {
                    guestId: "105664700188784427014"
                }
            ],
            restId: "1000",
            restName: "Loafe Cafe",
            timeOfMeet: 1605787405290,
        },
        ];
        Event.find = jest.fn().mockResolvedValue(events);
        const { body } = await request(app).post("/event/contactTrace", info);
        expect(body).toEqual({ pastEvents: events, notifiedUserIds: ["109786710572605387609"] });
        expect(body.statusCode).toEqual(200);
    });

    it("POST /event/contactTrace - fail not real user", async () => {
        const info = [{
            twoWeeksAgo: 1605009501688,
            timeOfMeet: 1605787406390,
            hostId: "1",
        }]
        const events = [{
            timeOfCreation: 1605009601688,
            isVerified: true,
            verifyCode: "436",
            eventId: "r1000h105664700188784427014t1605787405390",
            hostId: "1",
            guestIds: [
                {
                    guestId: "109786710572605387609"
                }
            ],
            restId: "1000",
            restName: "Loafe Cafe",
            timeOfMeet: 1605787405390,
        }];
        Event.find = jest.fn().mockResolvedValue(events);
        const { body } = await request(app).post("/event/contactTrace", info);
        expect(body).toEqual("error, no user found by userId");
        expect(body.statusCode).toEqual(410);
    });
});