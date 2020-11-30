// mongoose model for the routes we are testing
const User = require("../../models/user");
const Event = require("../../models/event");

// modules that will be mocked
const pushNotify = require("../../emitter");

// We use the module mockingoose to mock mongoose functions
const mockingoose = require("mockingoose").default;

// Set up a testing express app
const express = require("express"); 
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
const eventRoute = require("../../routes/event.js");
app.use("/event", eventRoute);

// Set up supertest to test the user routes module
const supertest = require("supertest"); // supertest is a framework that allows to easily test web apis
const request = supertest(app);


describe("Event Model standard calls", () => {

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
  const guest = new User({
    userId: "1",
    username: "Arnold",
    deviceToken: "x",
  });

  // set up mockingoose and default ret vals for each mongoose function
  beforeEach(() => {
    mockingoose(Event).toReturn([event], "find");
    mockingoose(Event).toReturn(event, "findOne");
    mockingoose(Event).toReturn(event, "findOneAndUpdate");
    mockingoose(Event).toReturn(event, "save");
    mockingoose(Event).toReturn(null, "deleteOne");
    mockingoose(Event).toReturn(null, "deleteMany");
    mockingoose(User).toReturn(guest, "findOne");
    pushNotify.emit = jest.fn();
  });
  // make sure the call count is cleared after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    mockingoose.resetAll();
  });

  it("Event GET /getall", async () => {

    const res = await request.get("/event/getAll"); //uses the request function that calls on express app instance

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].eventId).toBe(event.eventId);
  });

  it("Event POST /toVerify", async () => {

    const res = await request.post("/event/toVerify").send([guest]);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].eventId).toBe(event.eventId);
  });

  it("Event GET /", async () => {
    const res = await request.get("/event").send({
      eventId: "1",
    });

    expect(res.status).toBe(200);
    expect(res.body.eventId).toBe(event.eventId);
  });

  it("Event POST /", async () => {

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
    expect(pushNotify.emit).toHaveBeenCalledTimes(1);
    expect(res.body.eventId).toBe(`r${"fake restaurant"}h${"xd"}t${1827192837}`);
  });

  it("Event DELETE /", async () => {

    const res = await request.delete("/event").send({
      eventId: "69"
    });

    expect(res.status).toBe(200);
    expect(res.body).toBe("delete successful");
  });

  it("Event PUT /verify", async () => {

    const res = await request.put("/event/verify").send({
      eventId: "69",
      verifyCode: "420",
      guestId: "69420"
    });

    expect(res.status).toBe(200);
    expect(pushNotify.emit).toHaveBeenCalledTimes(1);
    expect(res.body).toBe("verify successful");
  });

  it("Event POST /contactTrace", async () => {

    const res = await request.post("/event/contactTrace").send({
      userId: "1",
      twoWeeksAgo: 21312378273,
      currentDate: 21312378273
    });

    expect(res.status).toBe(200);
    expect(pushNotify.emit).toHaveBeenCalledTimes(2);
    expect(res.body.notifiedUserIds.length).toBe(1);
    expect(res.body.pastEvents.length).toBe(1);
  });
});

describe("Event Model bad / improper calls", () => {
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
  const guest = new User({
    userId: "1",
    username: "Arnold",
    deviceToken: "x",
  });

  // set up mockingoose for mocking the mongoose functions
  beforeEach(() => {
    mockingoose(Event).toReturn([event], "find");
    mockingoose(Event).toReturn(event, "findOne");
    mockingoose(Event).toReturn(event, "findOneAndUpdate");
    mockingoose(Event).toReturn(event, "save");
    mockingoose(Event).toReturn(null, "deleteOne");
    mockingoose(User).toReturn(guest, "findOne");
    pushNotify.emit = jest.fn();
  });

  // make sure the call count is cleared after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    mockingoose.resetAll();
  });

  it("Event GET /getall error and null response from mongoose", async () => {

    // error
    mockingoose(Event).toReturn(new Error("error"), "find");
    const res = await request.get("/event/getAll");

    expect(res.status).toBe(404);
    expect(res.body).toBeTruthy();

    // null
    mockingoose(Event).toReturn(null, "find");
    const resn = await request.get("/event/getAll");

    expect(resn.status).toBe(204);
    expect(resn.body).toBeTruthy();
  });

  it("Event POST /toVerify null input", async () => {

    const res = await request.post("/event/toVerify").send([{
      userId: null,
      username: "Arnold",
      deviceToken: "x",
    }]);

    expect(res.status).toBe(400);
    expect(res.body).toBe("bad input");
  });

  it("Event POST /toVerify error response from mongoose", async () => {

    mockingoose(Event).toReturn(new Error("error"), "find");
    const res = await request.post("/event/toVerify").send([{
      userId: "not null",
      username: "Arnold",
      deviceToken: "x",
    }]);

    expect(res.status).toBe(404);
    expect(res.body).toBeTruthy();
  });

  it("Event GET / null input", async () => {
    const res = await request.get("/event").send({
      eventId: null,
    });

    expect(res.body).toBeTruthy();
    expect(res.status).toBe(400);
  });

  it("Event GET / error and null response from mongoose", async () => {
    // error
    mockingoose(Event).toReturn(new Error("error"), "findOne");
    const res = await request.get("/event").send({
      eventId: "not null",
    });

    expect(res.status).toBe(404);
    expect(res.body).toBeTruthy();

    // null
    mockingoose(Event).toReturn(null, "findOne");
    const resn = await request.get("/event").send({
      eventId: "not null",
    });

    expect(resn.status).toBe(204);
    expect(resn.body).toBeTruthy();
  });

  it("Event POST / null inputs", async () => {
    const res = await request.post("/event").send(null);

    expect(res.status).toBe(400);
    expect(res.body).toBe("bad input");

    const resn = await request.post("/event").send({
      hostId: null,
      guestIds: [
        { guestid: "2" }
      ],
      restId: null,
      restName: "fake name",
      timeOfMeet: 1827192837,
    });

    expect(resn.status).toBe(400);
    expect(resn.body).toBe("bad input");
  });

  it("Event POST / bad inputs", async () => {
    // too many guests
    const res = await request.post("/event").send({
      hostId: "not null",
      guestIds: [
        { guestid: "2" }, { guestid: "2" }, { guestid: "2" }, { guestid: "2" }, { guestid: "2" }, { guestid: "2" }, { guestid: "2" }, { guestid: "2" },
      ],
      restId: "fake restaurant",
      restName: "fake name",
      timeOfMeet: 1827192837,
    });

    expect(res.status).toBe(431);
    expect(res.body).toBe("Request header field too large");

    // host in the guest list
    const resn = await request.post("/event").send({
      hostId: "not null",
      guestIds: [
        { guestId: "not null" }, { guestId: "2" },
      ],
      restId: "fake restaurant",
      restName: "fake name",
      timeOfMeet: 1827192837,
    });

    expect(resn.status).toBe(405);
    expect(resn.body).toBe("host cannot create meetup with themselves");

  });

  it("Event POST / error and null response from mongoose", async () => {
    // error
    mockingoose(Event).toReturn(new Error("error"), "save");
    const res = await request.post("/event").send({
      hostId: "1",
      guestIds: [
        { guestId: "2" },
      ],
      restId: "fake restaurant",
      restName: "fake name",
      timeOfMeet: 1827192837,
    });

    expect(res.status).toBe(502);
    expect(res.body).toBeTruthy();
  });

  it("Event DELETE / null input", async () => {

    const res = await request.delete("/event").send({
      eventId: null
    });

    expect(res.body).toBeTruthy();
    expect(res.status).toBe(400);
  });

  it("Event DELETE / error and null mongoose response", async () => {
    // error
    mockingoose(Event).toReturn(new Error("error"), "deleteOne");
    const res = await request.delete("/event").send({
      eventId: "not null"
    });

    expect(res.body).toBeTruthy();
    expect(res.status).toBe(404);

    // null
    mockingoose(Event).toReturn(null, "deleteOne");
    const resn = await request.delete("/event").send({
      eventId: "not null"
    });

    expect(resn.body).toBeTruthy();
    expect(resn.status).toBe(200);
  });

  it("Event PUT /verify null input", async () => {

    const res = await request.put("/event/verify").send({
      eventId: null,
      verifyCode: "420",
      guestId: "69420"
    });

    expect(res.status).toBe(400);
    expect(res.body).toBe("bad input");
  });

  it("Event PUT /verify error and null Event response", async () => {

    // this endpoint makes multiple mongoose calls so we have to mock multiple times
    // to test all the branches
    // error response
    mockingoose(Event).toReturn(new Error("error"), "findOne");
    const res = await request.put("/event/verify").send({
      eventId: "not null",
      verifyCode: "420",
      guestId: "69420"
    });

    expect(res.status).toBe(404);
    expect(res.body).toBeTruthy();

    // null responses
    mockingoose(Event).toReturn(null, "findOne");
    mockingoose(User).toReturn(new Error("error"), "findOne");
    const res1 = await request.put("/event/verify").send({
      eventId: "not null",
      verifyCode: "420",
      guestId: "69420"
    });

    expect(res1.status).toBe(404);
    expect(res1.body).toBeTruthy();
    
    mockingoose(Event).toReturn(null, "findOne");
    mockingoose(User).toReturn(null, "findOne");
    const res2 = await request.put("/event/verify").send({
      eventId: "not null",
      verifyCode: "420",
      guestId: "69420"
    });

    expect(res2.status).toBe(410);
    expect(res2.body).toBe("user not in database");
    
    mockingoose(Event).toReturn(null, "findOne");
    mockingoose(User).toReturn(guest, "findOne");
    const res3 = await request.put("/event/verify").send({
      eventId: "not null",
      verifyCode: "420",
      guestId: "69420"
    });

    expect(res3.status).toBe(304);
    expect(res3.body).toBeTruthy();
  });

  it("Event PUT /verify error and null Uesr response", async () => {

    // this endpoint makes multiple mongoose calls so we have to mock multiple times
    // to test all the branches
    // normal response for event and user
    const res = await request.put("/event/verify").send({
      eventId: "not null",
      verifyCode: "420",
      guestId: "4"
    });

    expect(res.status).toBe(200);
    expect(res.body).toBe("verify successful");

    // error response from event 
    mockingoose(Event).toReturn(new Error("error"), "findOneAndUpdate");
    const res1 = await request.put("/event/verify").send({
      eventId: "not null",
      verifyCode: "420",
      guestId: "69420"
    });

    expect(res1.status).toBe(404);
    expect(res1.body).toBeTruthy();

    // good response from event findOneAndUpdate
    // testing branches for User.findOne
    mockingoose(Event).toReturn(event, "findOneAndUpdate");
    mockingoose(User).toReturn(new Error("error"), "findOne");
    const res2 = await request.put("/event/verify").send({
      eventId: "not null",
      verifyCode: "420",
      guestId: "69420"
    });

    expect(res2.status).toBe(404);
    expect(res2.body).toBeTruthy();
    
    mockingoose(Event).toReturn(event, "findOneAndUpdate");
    mockingoose(User).toReturn(null, "findOne");
    const res3 = await request.put("/event/verify").send({
      eventId: "not null",
      verifyCode: "420",
      guestId: "69420"
    });

    expect(res3.status).toBe(410);
    expect(res3.body).toBeTruthy();
  });

  it("Event POST /contactTrace null input", async () => {

    const res = await request.post("/event/contactTrace").send({
      userId: null
    });

    expect(res.status).toBe(400);
    expect(res.body).toBe("bad input");
  });

  it("Event POST /contactTrace notify host", async () => {

    const res = await request.post("/event/contactTrace").send({
      userId: "4",
      twoWeeksAgo: 21312378273,
      currentDate: 21312378273
    });

    expect(res.status).toBe(200);
  });

  it("Event POST /contactTrace error responses from mongoose", async () => {

    mockingoose(Event).toReturn(new Error("error"), "find");
    const res = await request.post("/event/contactTrace").send({
      userId: "4",
      twoWeeksAgo: 21312378273,
      currentDate: 21312378273
    });

    expect(res.status).toBe(404);    

    // User.findOne bad response
    // error
    mockingoose(Event).toReturn(event, "find");
    mockingoose(User).toReturn(new Error("error"), "findOne");
    const res1 = await request.post("/event/contactTrace").send({
      userId: "4",
      twoWeeksAgo: 21312378273,
      currentDate: 21312378273
    });

    expect(res1.status).toBe(404);

    // null
    mockingoose(Event).toReturn(event, "find");
    mockingoose(User).toReturn(null, "findOne");
    const res2 = await request.post("/event/contactTrace").send({
      userId: "4",
      twoWeeksAgo: 21312378273,
      currentDate: 21312378273
    });

    expect(res2.status).toBe(410);

    // empty 
    mockingoose(Event).toReturn([], "find");
    mockingoose(User).toReturn(guest, "findOne");
    const res3 = await request.post("/event/contactTrace").send({
      userId: "4",
      twoWeeksAgo: 21312378273,
      currentDate: 21312378273
    });

    expect(res3.status).toBe(200);
  });
});