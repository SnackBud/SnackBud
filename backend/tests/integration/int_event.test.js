const express = require("express"); // import express
const request = require("supertest"); // supertest is a framework that allows to easily test web apis

const eventRoute = require("../../routes/event.js");

const app = express(); //an instance of an express app, a ""fake" express app
app.use("/event", eventRoute);
const Event = require("../../models/event");

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
        const res = await request(app).get("/");
        expect(res.body).toEqual("home");
        expect(res.body.statusCode).toEqual(200);
    });

    it("GET /event - success", async () => {
        Event.findOne = jest.fn().mockResolvedValue([{
            timeOfCreation: 1605009601688n,
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
            timeOfMeet: 1605787405385n
        },
        ]);
        const res = await request(app).get("/event").send(
            { eventId: "r3h1t1605787405385" });
        expect(res.body).toEqual([{
            timeOfCreation: 1605009601688n,
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
            timeOfMeet: 1605787405385n
        }]);
        // expect(body.statusCode).toEqual(200);
    });

    it("GET /event - success no entry by that id", async () => {
        const res = await request(app).get("/event",
            { eventId: "r3" });
        expect(res.body).toEqual(null);
        expect(res.body.statusCode).toEqual(204);
    });

    it("GET /event - fail null id", async () => {
        const res = await request(app).get("/event");
        expect(res.body.statusCode).toEqual(400);
    });

    it("GET /event/getAll - success", async () => {
        const events = [{
            timeOfCreation: 1605009601688n,
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
            timeOfMeet: 1605787405385n
        },
        {
            timeOfCreation: 1605009601689n,
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
            timeOfMeet: 1605787405386n
        }
        ];
        Event.find = jest.fn().mockResolvedValue(events);
        const res = await request(app).get("/event/getAll");
        expect(res.body).toEqual(events);
        expect(res.body.statusCode).toEqual(200);
    });

    it("POST /event/getUser - success", async () => {
        const events = [{
            timeOfCreation: 1605009601688n,
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
            timeOfMeet: 1605787405385n
        },
        {
            timeOfCreation: 1605009601689n,
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
            timeOfMeet: 1605787405386n
        }
        ];

        Event.find = jest.fn().mockResolvedValue(events);
        const res = await request(app).post("/event/getUser",
            { userId: "2" });
        expect(res.body).toEqual(events);
        expect(res.body.statusCode).toEqual(200);
    });

    it("GET /event/getUser - fail null id", async () => {
        const res = await request(app).post("/event/getUser");
        expect(res.body.statusCode).toEqual(400);
    });

    it("POST /event - fail null id", async () => {
        const res = await request(app).post("/event");
        expect(res.body).toEqual("bad input");
        expect(res.body.statusCode).toEqual(400);
    });

    it("POST /event - fail create meet with oneself", async () => {
        const event = [{
            hostId: "1",
            guestIds: [
                {
                    guestId: "2"
                },
                {
                    guestId: "1"
                },
                {
                    guestId: "3"
                }
            ],
            restId: "3",
            restName: "Loafe Cafe",
            timeOfMeet: 1605787405385n
        }];
        const res = await request(app).post("/event", event);
        expect(res.body).toEqual({ message: "host cannot create meetup with themselves" });
        expect(res.body.statusCode).toEqual(405);
    });

    it("POST /event - fail too many guests", async () => {
        const event = [{
            hostId: "1",
            guestIds: [
                {
                    guestId: "2"
                },
                {
                    guestId: "1"
                },
                {
                    guestId: "3"
                },
                {
                    guestId: "4"
                },
                {
                    guestId: "5"
                },
                {
                    guestId: "6"
                },
                {
                    guestId: "7"
                }
            ],
            restId: "3",
            restName: "Loafe Cafe",
            timeOfMeet: 1605787405385n
        }];
        const res = await request(app).post("/event", event);
        expect(res.body).toEqual("Request header field too large");
        expect(res.body.statusCode).toEqual(431);
    });

    it("POST & DELETE /event - success", async () => {
        const event = [{
            eventId: "r3h1t1605787405385",
            hostId: "1",
            guestIds: [
                {
                    guestId: "2"
                },
                {
                    guestId: "3"
                },
            ],
            restId: "3",
            restName: "Loafe Cafe",
            timeOfMeet: 1605787405385n
        }];
        const res1 = await request(app).post("/event", event);
        expect(res1.body).toEqual(event);
        expect(res1.body.statusCode).toEqual(201);

        //DELETE ONCE
        const res2 = await request(app).delete("/event", event); //uses the request function that calls on express app instance
        expect(res2.body).toEqual("delete successful");
        expect(res2.body.statusCode).toEqual(200);

        //Check for missing resource
        const res3 = await request(app).get("/event", event); //uses the request function that calls on express app instance
        expect(res3.body.statusCode).toEqual(204);

        //SHOULD BE DELETED, GET ERROR CASE OF DOUBLE DELETE
        const res4 = await request(app).delete("/event", event); //uses the request function that calls on express app instance
        expect(res4.body).toEqual("already deleted");
        expect(res4.body.statusCode).toEqual(410);
    });

    it("DELETE /event - fail null id", async () => {
        const res = await request(app).delete("/event");
        expect(res.body).toEqual("bad input");
        expect(res.body.statusCode).toEqual(400);
    });

    it("PUT /event - fail, already verified meetup", async () => {
        const event = [{
            timeOfCreation: 1605009601688n,
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
            timeOfMeet: 1605787405385n,
            guestId: "109786710572605387609"
        },
        ];
        const res = await request(app).put("/event", event);
        expect(res.body).toEqual("meetup not modified");
        expect(res.body.statusCode).toEqual(304);
    });

    it("POST & PUT /event - fail, not a real guest user", async () => {
        const event = [{
            eventId: "r3h1t1605787405385",
            hostId: "1",
            guestIds: [
                {
                    guestId: "2"
                },
                {
                    guestId: "3"
                },
            ],
            restId: "3",
            restName: "Loafe Cafe",
            timeOfMeet: 1605787405385n,
            verifyCode: "111",
            isVerified: false,
            guestId: "3",

        }];
        const res1 = await request(app).post("/event", event);
        expect(res1.body).toEqual(event);
        expect(res1.body.statusCode).toEqual(201);

        //VERIFY MEETUP for first time, but wrong user
        const res2 = await request(app).put("/event", event);
        expect(res2.body).toEqual("user not in database");
        expect(res2.body.statusCode).toEqual(410);
        //Meetup already verified, but wrong user
        const res3 = await request(app).put("/event", event);
        expect(res3.body).toEqual("user not in database");
        expect(res3.body.statusCode).toEqual(410);

        //DELETE ONCE CREATED
        const res4 = await request(app).delete("/event", event); //uses the request function that calls on express app instance
        expect(res4.body).toEqual("delete successful");
        expect(res4.body.statusCode).toEqual(200);
    });

    it("POST & PUT & DELETE /event - success", async () => {
        const event = [{
            timeOfCreation: 1605009601688n,
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
            timeOfMeet: 1605787405390n,
            guestId: "109786710572605387609"
        },
        ];
        const res1 = await request(app).post("/event", event);
        expect(res1.body).toEqual(event);
        expect(res1.body.statusCode).toEqual(201);

        //VERIFY MEETUP, but wrong user
        const res2 = await request(app).put("/event", event);
        expect(res2.body).toEqual("verify successful");
        expect(res2.body.statusCode).toEqual(200);

        //DELETE ONCE VERIFED
        const res3 = await request(app).delete("/event", event); //uses the request function that calls on express app instance
        expect(res3.body).toEqual("delete successful");
        expect(res3.body.statusCode).toEqual(200);
    });


    it("POST /event/contactTrace - fail null id", async () => {
        const res = await request(app).post("/event/contactTrace");
        expect(res.body).toEqual("bad input");
        expect(res.body.statusCode).toEqual(400);
    });

    it("POST /event/contactTrace - success with no meetups", async () => {
        const info = [{
            twoWeeksAgo: 1605009501688n,
            timeOfMeet: 1605787406390n,
            hostId: "105664700188784427014",
        }];
        const events = [{
            timeOfCreation: 1605009601688n,
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
            timeOfMeet: 1605787405390n,
        }];
        Event.find = jest.fn().mockResolvedValue(events);
        const res = await request(app).post("/event/contactTrace", info);
        expect(res.body).toEqual("no at risk meet-ups");
        expect(res.body.statusCode).toEqual(200);
    });

    it("POST /event/contactTrace - success with reports", async () => {
        const info = [{
            twoWeeksAgo: 1605009501688n,
            timeOfMeet: 1605787406390n,
            hostId: "105664700188784427014",
        }];
        const events = [{
            timeOfCreation: 1605009601688n,
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
            timeOfMeet: 1605787405390n,
        },
        {
            timeOfCreation: 1605009601683n,
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
            timeOfMeet: 1605787405290n,
        },
        ];
        Event.find = jest.fn().mockResolvedValue(events);
        const res = await request(app).post("/event/contactTrace", info);
        expect(res.body).toEqual({ pastEvents: events, notifiedUserIds: ["109786710572605387609"] });
        expect(res.body.statusCode).toEqual(200);
    });

    it("POST /event/contactTrace - fail not real user", async () => {
        const info = [{
            twoWeeksAgo: 1605009501688n,
            timeOfMeet: 1605787406390n,
            hostId: "1",
        }];
        const events = [{
            timeOfCreation: 1605009601688n,
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
            timeOfMeet: 1605787405390n,
        }];
        Event.find = jest.fn().mockResolvedValue(events);
        const res = await request(app).post("/event/contactTrace", info);
        expect(res.body).toEqual("error, no user found by userId");
        expect(res.body.statusCode).toEqual(410);
    });
});