// import the User model to mock the calls to database so we can test error cases
const User = require("../../models/user");
const Event = require("../../models/event");
const mockingoose = require("mockingoose").default;

const app = require("../../app");
const supertest = require("supertest"); // supertest is a framework that allows to easily test web apis
const request = supertest(app);

describe("testing route GET /event", () => {
    const event = new Event({
        eventId: "22",
        hostId: "1",
        restname: "Mcdonald",
        guestIds: [
            { guestId: "4" },
        ],
        notVerified: [
            { guestId: "4" },
        ]
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
        mockingoose.resetAll();
    });

    afterAll(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
        mockingoose.resetAll();
    });


    it("GET /event - success", async () => {
        mockingoose(Event).toReturn(event, "findOne");
        const res = await request.get("/event").send({ eventId: "1" });

        expect(res.status).toBe(200);
    });

    it("GET /event - bad input", async () => {
        const res = await request.get("/event").send({ eventId: null });

        expect(res.status).toBe(400);
    });

    it("GET /event - mongoose returns error", async () => {
        mockingoose(Event).toReturn(new Error("error"), "findOne");
        const res = await request.get("/event").send({ eventId: "1" });

        expect(res.status).toBe(404);
    });

    it("GET /event - mongoose returns null", async () => {
        mockingoose(Event).toReturn(null, "findOne");
        const res = await request.get("/event").send({ eventId: "1" });

        expect(res.status).toBe(204);
    });
});

describe("testing route GET /event/getAll", () => {
    const event = new Event({
        eventId: "22",
        hostId: "1",
        restname: "Mcdonald",
        guestIds: [
            { guestId: "4" },
        ],
        notVerified: [
            { guestId: "4" },
        ]
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
        mockingoose.resetAll();
    });

    afterAll(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
        mockingoose.resetAll();
    });


    it("GET /event/getAll - success", async () => {
        mockingoose(Event).toReturn(event, "find");
        const res = await request.get("/event/getAll").send({ eventId: "1" });

        expect(res.status).toBe(200);
    });

    it("GET /event/getAll - mongoose returns error", async () => {
        mockingoose(Event).toReturn(new Error("error"), "find");
        const res = await request.get("/event/getAll").send({ eventId: "1" });

        expect(res.status).toBe(404);
    });

    it("GET /event/getAll - mongoose returns null", async () => {
        mockingoose(Event).toReturn(null, "find");
        const res = await request.get("/event/getAll").send({ eventId: "1" });

        expect(res.status).toBe(204);
    });
});

describe("testing route POST /event/toVerify", () => {
    const event = new Event({
        eventId: "22",
        hostId: "1",
        restname: "Mcdonald",
        guestIds: [
            { guestId: "4" },
        ],
        notVerified: [
            { guestId: "4" },
        ]
    });

    beforeEach(() => {
        mockingoose.resetAll();
    });

    afterAll(() => {
        mockingoose.resetAll();
    });

    it("POST /event/toVerify - success", async () => {
        mockingoose(Event).toReturn(event, "find");
        const res = await request.post("/event/toVerify").send([{ userId: "1" }]);

        expect(res.status).toBe(200);
    });

    it("POST /event/toVerify - bad input", async () => {
        const res = await request.post("/event/toVerify").send([{ userId: null }]);

        expect(res.status).toBe(400);
    });

    it("POST /event/toVerify - mongoose returns error", async () => {
        mockingoose(Event).toReturn(new Error("error"), "find");
        const res = await request.post("/event/toVerify").send([{ userId: "1" }]);

        expect(res.status).toBe(404);
    });
});

describe("testing route DELETE /event", () => {
    const event = new Event({
        eventId: "22",
        hostId: "1",
        restname: "Mcdonald",
        guestIds: [
            { guestId: "4" },
        ],
        notVerified: [
            { guestId: "4" },
        ]
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
        mockingoose.resetAll();
    });

    afterAll(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
        mockingoose.resetAll();
    });


    it("DELETE /event - success", async () => {
        mockingoose(Event).toReturn(event, "deleteOne");
        const res = await request.delete("/event").send({ eventId: "1" });

        expect(res.status).toBe(200);
    });

    it("DELETE /event - bad input", async () => {
        const res = await request.delete("/event").send({ eventId: null });

        expect(res.status).toBe(400);
    });

    it("DELETE /event - mongoose returns error", async () => {
        mockingoose(Event).toReturn(new Error("error"), "deleteOne");
        const res = await request.delete("/event").send({ eventId: "1" });

        expect(res.status).toBe(404);
    });
});

describe("testing route PUT /event/verify", () => {
    const guest = new User({
        userId: "1",
        username: "Arnold",
        deviceToken: "x",
    });

    const event = new Event({
        eventId: "22",
        hostId: "1",
        restname: "Mcdonald",
        guestIds: [
            { guestId: "4" },
        ],
        notVerified: [
            { guestId: "4" },
        ]
    });

    const event2 = new Event({
        eventId: "22",
        hostId: "1",
        restname: "Mcdonald",
        guestIds: [
            { guestId: "4" },
            { guestId: "6" },
        ],
        notVerified: [
            { guestId: "4" },
            { guestId: "6" },
        ]
    });

    const event3 = new Event({
        eventId: "22",
        hostId: "3",
        restname: "Mcdonald",
        guestIds: [
            { guestId: "4" },
            { guestId: "6" },
        ],
        notVerified: [
            { guestId: "4" },
            { guestId: "6" },
        ]
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
        mockingoose.resetAll();
    });

    afterAll(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
        mockingoose.resetAll();
    });


    it("PUT /event/verify - success", async () => {
        mockingoose(Event).toReturn(event, "findOne");
        mockingoose(Event).toReturn(event, "findOneAndUpdate");
        mockingoose(User).toReturn(guest, "findOne");
        const res = await request.put("/event/verify").send({
            eventId: "1",
            verifyCode: "69",
            guestId: "4"
        });

        expect(res.status).toBe(200);
    });

    it("PUT /event/verify - success 2", async () => {
        mockingoose(Event).toReturn(event2, "findOne");
        mockingoose(Event).toReturn(event2, "findOneAndUpdate");
        mockingoose(User).toReturn(guest, "findOne");
        const res = await request.put("/event/verify").send({
            eventId: "1",
            verifyCode: "69",
            guestId: "4"
        });

        expect(res.status).toBe(200);
    });

    it("PUT /event/verify - success 3", async () => {
        mockingoose(Event).toReturn(event3, "findOne");
        mockingoose(Event).toReturn(event3, "findOneAndUpdate");
        mockingoose(User).toReturn(guest, "findOne");
        const res = await request.put("/event/verify").send({
            eventId: "22",
            verifyCode: "69",
            guestId: "4"
        });

        expect(res.status).toBe(200);
    });
    it("PUT /event/verify - bad input", async () => {
        const res = await request.put("/event/verify").send({
            eventId: null,
            verifyCode: "69",
            guestId: "2"
        });

        expect(res.status).toBe(400);
    });

    it("PUT /event/verify - mongoose returns error for Event.findOne", async () => {
        mockingoose(Event).toReturn(new Error("error"), "findOne");
        const res = await request.put("/event/verify").send({
            eventId: "1",
            verifyCode: "69",
            guestId: "2"
        });

        expect(res.status).toBe(404);
    });

    it("PUT /event/verify - mongoose returns null for Event.findOne, normal for User.findOne", async () => {
        mockingoose(Event).toReturn(null, "findOne");
        mockingoose(User).toReturn(guest, "findOne");
        const res = await request.put("/event/verify").send({
            eventId: "1",
            verifyCode: "69",
            guestId: "2"
        });

        expect(res.status).toBe(304);
    });

    it("PUT /event/verify - mongoose returns null for Event.findOne, error for User.findOne", async () => {
        mockingoose(Event).toReturn(null, "findOne");
        mockingoose(User).toReturn(new Error("error"), "findOne");
        const res = await request.put("/event/verify").send({
            eventId: "1",
            verifyCode: "69",
            guestId: "2"
        });

        expect(res.status).toBe(404);
    });

    it("PUT /event/verify - mongoose returns null for Event.findOne, null for User.findOne", async () => {
        mockingoose(Event).toReturn(null, "findOne");
        mockingoose(User).toReturn(null, "findOne");
        const res = await request.put("/event/verify").send({
            eventId: "1",
            verifyCode: "69",
            guestId: "2"
        });

        expect(res.status).toBe(410);
    });

    it("PUT /event/verify - mongoose returns normal for Event.findOne, error for Event.findOneAndUpdate", async () => {
        mockingoose(Event).toReturn(event, "findOne");
        mockingoose(Event).toReturn(new Error("error"), "findOneAndUpdate");
        const res = await request.put("/event/verify").send({
            eventId: "1",
            verifyCode: "69",
            guestId: "2"
        });

        expect(res.status).toBe(404);
    });

    it("PUT /event/verify - mongoose returns normal for Event.findOne, error for User.findOne", async () => {
        mockingoose(Event).toReturn(event, "findOne");
        mockingoose(Event).toReturn(event, "findOneAndUpdate");
        mockingoose(User).toReturn(new Error("error"), "findOne");
        const res = await request.put("/event/verify").send({
            eventId: "1",
            verifyCode: "69",
            guestId: "2"
        });

        expect(res.status).toBe(404);
    });

    it("PUT /event/verify - mongoose returns normal for Event.findOne, null for User.findOne", async () => {
        mockingoose(Event).toReturn(event, "findOne");
        mockingoose(Event).toReturn(event, "findOneAndUpdate");
        mockingoose(User).toReturn(null, "findOne");
        const res = await request.put("/event/verify").send({
            eventId: "1",
            verifyCode: "69",
            guestId: "2"
        });

        expect(res.status).toBe(410);
    });
});

describe("testing route POST /event", () => {
    const guest = new User({
        userId: "1",
        username: "Arnold",
        deviceToken: "x",
    });

    const event = new Event({
        eventId: "22",
        hostId: "1",
        restname: "Mcdonald",
        guestIds: [
            { guestId: "4" },
        ],
        notVerified: [
            { guestId: "4" },
        ]
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
        mockingoose.resetAll();
    });

    afterAll(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
        mockingoose.resetAll();
    });

    it("POST /event - success", async () => {
        mockingoose(Event).toReturn(event, "save");
        mockingoose(User).toReturn(guest, "findOne");
        const res = await request.post("/event").send({
            userId: "1",
            hostId: "xd",
            guestIds: [
                { guestId: "2" }
            ],
            restId: "fake restaurant",
            restName: "fake name",
            timeOfMeet: 1827192837,
        });

        expect(res.status).toBe(200);
    });

    it("POST /event - error in notifyNewMeetup", async () => {
        mockingoose(Event).toReturn(event, "save");
        mockingoose(User).toReturn(new Error("error"), "findOne");


        const res = await request.post("/event").send({
            userId: "1",
            hostId: "22",
            guestIds: [
                { guestId: "2" }
            ],
            restId: "fake restaurant",
            restName: "fake name",
            timeOfMeet: 1827192837,
        });

        expect(res.status).toBe(200);
    });

    it("POST /event - bad input, null request", async () => {
        const res = await request.post("/event").send(null);

        expect(res.status).toBe(400);
    });

    it("POST /event - bad input, bad request: too many guests", async () => {
        const res = await request.post("/event").send({
            hostId: "not null",
            guestIds: [
                { guestId: "2" },
                { guestId: "3" },
                { guestId: "4" },
                { guestId: "5" },
                { guestId: "22" },
                { guestId: "223" },
                { guestId: "242" },
                { guestId: "3122" },
            ],
            restId: "fake restaurant",
            restName: "fake name",
            timeOfMeet: 1827192837,
        });

        expect(res.status).toBe(431);
    });

    it("POST /event - bad input, bad request: host is included within guests", async () => {
        const res = await request.post("/event").send({
            hostId: "1",
            guestIds: [
                { guestId: "1" },
            ],
            restId: "fake restaurant",
            restName: "fake name",
            timeOfMeet: 1827192837,
        });

        expect(res.status).toBe(405);
    });

    it("POST /event - mongoose returns error", async () => {
        mockingoose(Event).toReturn(new Error("error"), "save");
        mockingoose(User).toReturn(guest, "findOne");
        const res = await request.post("/event").send({
            userId: "1",
            hostId: "xd",
            guestIds: [
                { guestId: "2" }
            ],
            restId: "fake restaurant",
            restName: "fake name",
            timeOfMeet: 1827192837,
        });

        expect(res.status).toBe(502);
    });
});

describe("testing route POST /event/contactTrace", () => {
    const guest = new User({
        userId: "1",
        username: "Arnold",
        deviceToken: "x",
    });

    const event = new Event({
        eventId: "22",
        hostId: "1",
        restname: "Mcdonald",
        guestIds: [
            { guestId: "4" },
        ],
        notVerified: [
            { guestId: "4" },
        ]
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
        mockingoose.resetAll();
    });

    afterAll(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
        mockingoose.resetAll();
    });


    it("POST /event/contactTrace - success", async () => {
        mockingoose(Event).toReturn([event], "find");
        mockingoose(User).toReturn(guest, "findOne");
        const res = await request.post("/event/contactTrace").send({
            userId: "1",
            twoWeeksAgo: 21312378273,
            currentDate: 21312378273
        });

        expect(res.status).toBe(200);
    });

    it("POST /event/contactTrace - success, no past events", async () => {
        mockingoose(Event).toReturn([], "find");
        mockingoose(User).toReturn(guest, "findOne");
        const res = await request.post("/event/contactTrace").send({
            userId: "1",
            twoWeeksAgo: 21312378273,
            currentDate: 21312378273
        });

        expect(res.status).toBe(200);
    });

    it("POST /event/contactTrace - success, called by guest", async () => {
        mockingoose(Event).toReturn([event], "find");
        mockingoose(User).toReturn(guest, "findOne");
        const res = await request.post("/event/contactTrace").send({
            userId: "4",
            twoWeeksAgo: 21312378273,
            currentDate: 21312378273
        });

        expect(res.status).toBe(200);
    });

    it("POST /event/contactTrace - bad input, null request", async () => {
        const res = await request.post("/event/contactTrace").send(null);

        expect(res.status).toBe(400);
    });

    it("POST /event/contactTrace - mongoose returns error for Event.find", async () => {
        mockingoose(Event).toReturn(new Error("error"), "find");
        mockingoose(User).toReturn(guest, "findOne");
        const res = await request.post("/event/contactTrace").send({
            userId: "1",
            twoWeeksAgo: 21312378273,
            currentDate: 21312378273
        });

        expect(res.status).toBe(404);
    });

    it("POST /event/contactTrace - mongoose returns normal for Event.find, error for User.findOne", async () => {
        mockingoose(Event).toReturn([event], "find");
        mockingoose(User).toReturn(new Error("error"), "findOne");
        const res = await request.post("/event/contactTrace").send({
            userId: "1",
            twoWeeksAgo: 21312378273,
            currentDate: 21312378273
        });

        expect(res.status).toBe(404);
    });

    it("POST /event/contactTrace - mongoose returns normal for Event.find, null for User.findOne", async () => {
        mockingoose(Event).toReturn([event], "find");
        mockingoose(User).toReturn(null, "findOne");
        const res = await request.post("/event/contactTrace").send({
            userId: "1",
            twoWeeksAgo: 21312378273,
            currentDate: 21312378273
        });

        expect(res.status).toBe(410);
    });

});

// describe("testing-event-routes", () => {
//     beforeAll(() => {
//         // Event.findOne = jest.fn().mockResolvedValue([{
//         //     timeOfCreation: 1605009601688,
//         //     isVerified: true,
//         //     verifyCode: "436",
//         //     eventId: "r1000h105664700188784427014t1605787405385",
//         //     hostId: "105664700188784427014",
//         //     guestIds: [
//         //         {
//         //             guestId: "109786710572605387609"
//         //         }
//         //     ],
//         //     restId: "1000",
//         //     restName: "Loafe Cafe",
//         //     timeOfMeet: 1605787405385,
//         // },
//         // ]);

//         // Event.find = jest.fn().mockResolvedValue([{
//         //     username: "Arnold Ying",
//         //     userId: "109786710572605387609",
//         //     deviceToken: "x"
//         // },
//         // {
//         //     username: "Parsa Riahi",
//         //     userId: "114967596096028525632",
//         //     deviceToken: "y"
//         // }
//         // ]);
//     });

//     it("GET / - success", async () => {
//         const res = await request(app).get("/");
//         expect(res.body).toEqual("home");
//         expect(res.body.statusCode).toEqual(200);
//     });

//     it("GET /event - success", async () => {
//         Event.findOne = jest.fn().mockResolvedValue([{
//             timeOfCreation: 1605009601688n,
//             isVerified: true,
//             verifyCode: "123",
//             eventId: "r3h1t1605787405385",
//             hostId: "1",
//             guestIds: [
//                 {
//                     guestId: "2"
//                 }
//             ],
//             restId: "3",
//             restName: "Loafe Cafe",
//             timeOfMeet: 1605787405385n
//         },
//         ]);
//         const res = await request(app).get("/event").send(
//             { eventId: "r3h1t1605787405385" });
//         expect(res.body).toEqual([{
//             timeOfCreation: 1605009601688n,
//             isVerified: true,
//             verifyCode: "123",
//             eventId: "r3h1t1605787405385",
//             hostId: "1",
//             guestIds: [
//                 {
//                     guestId: "2"
//                 }
//             ],
//             restId: "3",
//             restName: "Loafe Cafe",
//             timeOfMeet: 1605787405385n
//         }]);
//         // expect(body.statusCode).toEqual(200);
//     });

//     it("GET /event - success no entry by that id", async () => {
//         const res = await request(app).get("/event",
//             { eventId: "r3" });
//         expect(res.body).toEqual(null);
//         expect(res.body.statusCode).toEqual(204);
//     });

//     it("GET /event - fail null id", async () => {
//         const res = await request(app).get("/event");
//         expect(res.body.statusCode).toEqual(400);
//     });

//     it("GET /event/getAll - success", async () => {
//         const events = [{
//             timeOfCreation: 1605009601688n,
//             isVerified: true,
//             verifyCode: "123",
//             eventId: "r3h1t1605787405385",
//             hostId: "1",
//             guestIds: [
//                 {
//                     guestId: "2"
//                 }
//             ],
//             restId: "3",
//             restName: "Loafe Cafe",
//             timeOfMeet: 1605787405385n
//         },
//         {
//             timeOfCreation: 1605009601689n,
//             isVerified: false,
//             verifyCode: "124",
//             eventId: "r4h2t1605787405386",
//             hostId: "2",
//             guestIds: [
//                 {
//                     guestId: "3"
//                 }
//             ],
//             restId: "4",
//             restName: "Tim Hortons",
//             timeOfMeet: 1605787405386n
//         }
//         ];
//         Event.find = jest.fn().mockResolvedValue(events);
//         const res = await request(app).get("/event/getAll");
//         expect(res.body).toEqual(events);
//         expect(res.body.statusCode).toEqual(200);
//     });

//     it("POST /event/getUser - success", async () => {
//         const events = [{
//             timeOfCreation: 1605009601688n,
//             isVerified: false,
//             verifyCode: "123",
//             eventId: "r3h1t1605787405385",
//             hostId: "1",
//             guestIds: [
//                 {
//                     guestId: "2"
//                 }
//             ],
//             restId: "3",
//             restName: "Loafe Cafe",
//             timeOfMeet: 1605787405385n
//         },
//         {
//             timeOfCreation: 1605009601689n,
//             isVerified: false,
//             verifyCode: "124",
//             eventId: "r4h2t1605787405386",
//             hostId: "2",
//             guestIds: [
//                 {
//                     guestId: "3"
//                 }
//             ],
//             restId: "4",
//             restName: "Tim Hortons",
//             timeOfMeet: 1605787405386n
//         }
//         ];

//         Event.find = jest.fn().mockResolvedValue(events);
//         const res = await request(app).post("/event/getUser",
//             { userId: "2" });
//         expect(res.body).toEqual(events);
//         expect(res.body.statusCode).toEqual(200);
//     });

//     it("GET /event/getUser - fail null id", async () => {
//         const res = await request(app).post("/event/getUser");
//         expect(res.body.statusCode).toEqual(400);
//     });

//     it("POST /event - fail null id", async () => {
//         const res = await request(app).post("/event");
//         expect(res.body).toEqual("bad input");
//         expect(res.body.statusCode).toEqual(400);
//     });

//     it("POST /event - fail create meet with oneself", async () => {
//         const event = [{
//             hostId: "1",
//             guestIds: [
//                 {
//                     guestId: "2"
//                 },
//                 {
//                     guestId: "1"
//                 },
//                 {
//                     guestId: "3"
//                 }
//             ],
//             restId: "3",
//             restName: "Loafe Cafe",
//             timeOfMeet: 1605787405385n
//         }];
//         const res = await request(app).post("/event", event);
//         expect(res.body).toEqual({ message: "host cannot create meetup with themselves" });
//         expect(res.body.statusCode).toEqual(405);
//     });

//     it("POST /event - fail too many guests", async () => {
//         const event = [{
//             hostId: "1",
//             guestIds: [
//                 {
//                     guestId: "2"
//                 },
//                 {
//                     guestId: "1"
//                 },
//                 {
//                     guestId: "3"
//                 },
//                 {
//                     guestId: "4"
//                 },
//                 {
//                     guestId: "5"
//                 },
//                 {
//                     guestId: "6"
//                 },
//                 {
//                     guestId: "7"
//                 }
//             ],
//             restId: "3",
//             restName: "Loafe Cafe",
//             timeOfMeet: 1605787405385n
//         }];
//         const res = await request(app).post("/event", event);
//         expect(res.body).toEqual("Request header field too large");
//         expect(res.body.statusCode).toEqual(431);
//     });

//     it("POST & DELETE /event - success", async () => {
//         const event = [{
//             eventId: "r3h1t1605787405385",
//             hostId: "1",
//             guestIds: [
//                 {
//                     guestId: "2"
//                 },
//                 {
//                     guestId: "3"
//                 },
//             ],
//             restId: "3",
//             restName: "Loafe Cafe",
//             timeOfMeet: 1605787405385n
//         }];
//         const res1 = await request(app).post("/event", event);
//         expect(res1.body).toEqual(event);
//         expect(res1.body.statusCode).toEqual(201);

//         //DELETE ONCE
//         const res2 = await request(app).delete("/event", event); //uses the request function that calls on express app instance
//         expect(res2.body).toEqual("delete successful");
//         expect(res2.body.statusCode).toEqual(200);

//         //Check for missing resource
//         const res3 = await request(app).get("/event", event); //uses the request function that calls on express app instance
//         expect(res3.body.statusCode).toEqual(204);

//         //SHOULD BE DELETED, GET ERROR CASE OF DOUBLE DELETE
//         const res4 = await request(app).delete("/event", event); //uses the request function that calls on express app instance
//         expect(res4.body).toEqual("already deleted");
//         expect(res4.body.statusCode).toEqual(410);
//     });

//     it("DELETE /event - fail null id", async () => {
//         const res = await request(app).delete("/event");
//         expect(res.body).toEqual("bad input");
//         expect(res.body.statusCode).toEqual(400);
//     });

//     it("PUT /event - fail, already verified meetup", async () => {
//         const event = [{
//             timeOfCreation: 1605009601688n,
//             isVerified: true,
//             verifyCode: "436",
//             eventId: "r1000h105664700188784427014t1605787405385",
//             hostId: "105664700188784427014",
//             guestIds: [
//                 {
//                     guestId: "109786710572605387609"
//                 }
//             ],
//             restId: "1000",
//             restName: "Loafe Cafe",
//             timeOfMeet: 1605787405385n,
//             guestId: "109786710572605387609"
//         },
//         ];
//         const res = await request(app).put("/event", event);
//         expect(res.body).toEqual("meetup not modified");
//         expect(res.body.statusCode).toEqual(304);
//     });

//     it("POST & PUT /event - fail, not a real guest user", async () => {
//         const event = [{
//             eventId: "r3h1t1605787405385",
//             hostId: "1",
//             guestIds: [
//                 {
//                     guestId: "2"
//                 },
//                 {
//                     guestId: "3"
//                 },
//             ],
//             restId: "3",
//             restName: "Loafe Cafe",
//             timeOfMeet: 1605787405385n,
//             verifyCode: "111",
//             isVerified: false,
//             guestId: "3",

//         }];
//         const res1 = await request(app).post("/event", event);
//         expect(res1.body).toEqual(event);
//         expect(res1.body.statusCode).toEqual(201);

//         //VERIFY MEETUP for first time, but wrong user
//         const res2 = await request(app).put("/event", event);
//         expect(res2.body).toEqual("user not in database");
//         expect(res2.body.statusCode).toEqual(410);
//         //Meetup already verified, but wrong user
//         const res3 = await request(app).put("/event", event);
//         expect(res3.body).toEqual("user not in database");
//         expect(res3.body.statusCode).toEqual(410);

//         //DELETE ONCE CREATED
//         const res4 = await request(app).delete("/event", event); //uses the request function that calls on express app instance
//         expect(res4.body).toEqual("delete successful");
//         expect(res4.body.statusCode).toEqual(200);
//     });

//     it("POST & PUT & DELETE /event - success", async () => {
//         const event = [{
//             timeOfCreation: 1605009601688n,
//             isVerified: false,
//             verifyCode: "436",
//             eventId: "r1000h105664700188784427014t1605787405390",
//             hostId: "105664700188784427014",
//             guestIds: [
//                 {
//                     guestId: "109786710572605387609"
//                 }
//             ],
//             restId: "1000",
//             restName: "Loafe Cafe",
//             timeOfMeet: 1605787405390n,
//             guestId: "109786710572605387609"
//         },
//         ];
//         const res1 = await request(app).post("/event", event);
//         expect(res1.body).toEqual(event);
//         expect(res1.body.statusCode).toEqual(201);

//         //VERIFY MEETUP, but wrong user
//         const res2 = await request(app).put("/event", event);
//         expect(res2.body).toEqual("verify successful");
//         expect(res2.body.statusCode).toEqual(200);

//         //DELETE ONCE VERIFED
//         const res3 = await request(app).delete("/event", event); //uses the request function that calls on express app instance
//         expect(res3.body).toEqual("delete successful");
//         expect(res3.body.statusCode).toEqual(200);
//     });


//     it("POST /event/contactTrace - fail null id", async () => {
//         const res = await request(app).post("/event/contactTrace");
//         expect(res.body).toEqual("bad input");
//         expect(res.body.statusCode).toEqual(400);
//     });

//     it("POST /event/contactTrace - success with no meetups", async () => {
//         const info = [{
//             twoWeeksAgo: 1605009501688n,
//             timeOfMeet: 1605787406390n,
//             hostId: "105664700188784427014",
//         }];
//         const events = [{
//             timeOfCreation: 1605009601688n,
//             isVerified: false,
//             verifyCode: "436",
//             eventId: "r1000h105664700188784427014t1605787405390",
//             hostId: "105664700188784427014",
//             guestIds: [
//                 {
//                     guestId: "109786710572605387609"
//                 }
//             ],
//             restId: "1000",
//             restName: "Loafe Cafe",
//             timeOfMeet: 1605787405390n,
//         }];
//         Event.find = jest.fn().mockResolvedValue(events);
//         const res = await request(app).post("/event/contactTrace", info);
//         expect(res.body).toEqual("no at risk meet-ups");
//         expect(res.body.statusCode).toEqual(200);
//     });

//     it("POST /event/contactTrace - success with reports", async () => {
//         const info = [{
//             twoWeeksAgo: 1605009501688n,
//             timeOfMeet: 1605787406390n,
//             hostId: "105664700188784427014",
//         }];
//         const events = [{
//             timeOfCreation: 1605009601688n,
//             isVerified: true,
//             verifyCode: "436",
//             eventId: "r1000h105664700188784427014t1605787405390",
//             hostId: "105664700188784427014",
//             guestIds: [
//                 {
//                     guestId: "109786710572605387609"
//                 }
//             ],
//             restId: "1000",
//             restName: "Loafe Cafe",
//             timeOfMeet: 1605787405390n,
//         },
//         {
//             timeOfCreation: 1605009601683n,
//             isVerified: true,
//             verifyCode: "436",
//             eventId: "r1000h109786710572605387609t1605787405390",
//             hostId: "109786710572605387609",
//             guestIds: [
//                 {
//                     guestId: "105664700188784427014"
//                 }
//             ],
//             restId: "1000",
//             restName: "Loafe Cafe",
//             timeOfMeet: 1605787405290n,
//         },
//         ];
//         Event.find = jest.fn().mockResolvedValue(events);
//         const res = await request(app).post("/event/contactTrace", info);
//         expect(res.body).toEqual({ pastEvents: events, notifiedUserIds: ["109786710572605387609"] });
//         expect(res.body.statusCode).toEqual(200);
//     });

//     it("POST /event/contactTrace - fail not real user", async () => {
//         const info = [{
//             twoWeeksAgo: 1605009501688n,
//             timeOfMeet: 1605787406390n,
//             hostId: "1",
//         }];
//         const events = [{
//             timeOfCreation: 1605009601688n,
//             isVerified: true,
//             verifyCode: "436",
//             eventId: "r1000h105664700188784427014t1605787405390",
//             hostId: "1",
//             guestIds: [
//                 {
//                     guestId: "109786710572605387609"
//                 }
//             ],
//             restId: "1000",
//             restName: "Loafe Cafe",
//             timeOfMeet: 1605787405390n,
//         }];
//         Event.find = jest.fn().mockResolvedValue(events);
//         const res = await request(app).post("/event/contactTrace", info);
//         expect(res.body).toEqual("error, no user found by userId");
//         expect(res.body.statusCode).toEqual(410);
//     });
// });