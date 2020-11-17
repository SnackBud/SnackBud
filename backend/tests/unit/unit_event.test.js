const Event = require("../../models/event");
const User = require("../../models/user");
const Helpers = require("../../helper");
const mockingoose = require('mockingoose').default;

const app = require('../../app') // Link to your server file
const supertest = require("supertest"); // supertest is a framework that allows to easily test web apis
const pushNotify = require("../../emitter");
const request = supertest(app)


describe("Event Model standard calls", () => {
  let helper = new Helpers();
  helper.notifyHelper = jest.fn();
  
  // set up mockingoose for mocking the mongoose functions
  beforeEach(() => {
    mockingoose.resetAll();
    const event = new Event({
      hostId: "1",
      restname: "Mcdonald",
      guestIds: [
        {guestId: "4"},
      ]
    });
    const delete1 = {
      acknolwedged: true,
      deletedCount: 1
    };
    const guest = new User({
      userId: "1",
      username: "Arnold",
      deviceToken: "x",
    });
    mockingoose(Event).toReturn([event], 'find');
    mockingoose(Event).toReturn(event, 'findOne');
    mockingoose(Event).toReturn(event, 'findOneAndUpdate');
    mockingoose(Event).toReturn(event, 'save');
    mockingoose(Event).toReturn(delete1, 'deleteOne');
    mockingoose(User).toReturn(guest, 'findOne');
    pushNotify.emit = jest.fn();
  });
  // make sure the call count is cleared after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Event GET /getall", async () => {

    const res = await request.get("/event/getAll"); //uses the request function that calls on express app instance

    expect(res.body).toBeTruthy();
    expect(res.status).toBe(200);
  });

  it("Event POST /getUser", async () => {
    const guest = new User({
      userId: "1",
      username: "Arnold",
      deviceToken: "x",
    });

    const res = await request.post("/event/getUser").send([guest]);

    expect(res.body).toBeTruthy();
    expect(res.status).toBe(200);
  });

  it("Event GET /", async () => {
    const res = await request.get("/event").send({
      eventId: "1",
    }); 

    expect(res.body).toBeTruthy();
    expect(res.status).toBe(200);
  });  
  
  it("Event POST /", async () => {

    const res = await request.post("/event").send({
      userId: "1",
      hostId: "xd",
      guestIds: [
        {guestid: "2"}
      ],
      restId: "fake restaurant",
      restName: "fake name",
      timeOfMeet: 1827192837,
    }); 

    expect(pushNotify.emit).toHaveBeenCalledTimes(1);
    expect(res.body).toBeTruthy();
    expect(res.status).toBe(200);
  }); 
  
  it("Event DELETE /", async () => {

    const res = await request.delete("/event").send({
      eventId: "69"
    }); 

    expect(res.body).toBeTruthy();
    expect(res.status).toBe(404);
  });

  it("Event PUT /", async () => {

    const res = await request.put("/event").send({
      eventId: "69",
      verifyCode: "420",
      guestId: "69420"
    }); 

    expect(res.body).toBeTruthy();
    expect(res.status).toBe(200);
  });

  it("Event POST /contactTrace", async () => {

    const res = await request.post("/event/contactTrace").send({
      userId: "69",
      twoWeeksAgo: 21312378273,
      currentDate: 21312378273
    }); 

    expect(res.body).toBeTruthy();
    expect(res.status).toBe(200);
  });
});

describe("Event Model bad / improper calls", () => {
  let helper = new Helpers();
  helper.notifyHelper = jest.fn();
  
  // set up mockingoose for mocking the mongoose functions
  beforeEach(() => {
    mockingoose.resetAll();
    const event = new Event({
      hostId: "1",
      restname: "Mcdonald",
      guestIds: [
        {guestId: "4"},
      ]
    });
    const delete1 = {
      acknolwedged: true,
      deletedCount: 1
    };
    const guest = new User({
      userId: "1",
      username: "Arnold",
      deviceToken: "x",
    });
    mockingoose(Event).toReturn([event], 'find');
    mockingoose(Event).toReturn(event, 'findOne');
    mockingoose(Event).toReturn(event, 'findOneAndUpdate');
    mockingoose(Event).toReturn(event, 'save');
    mockingoose(Event).toReturn(delete1, 'deleteOne');
    mockingoose(User).toReturn(guest, 'findOne');
    pushNotify.emit = jest.fn();
  });

  // make sure the call count is cleared after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Event GET /getall error and null response from mongoose", async () => {

    // error
    mockingoose(Event).toReturn(new Error('error'), 'find');
    const res = await request.get("/event/getAll"); 

    expect(res.body).toBeTruthy();
    expect(res.status).toBe(404);

    // null
    mockingoose(Event).toReturn(null, 'find');
    const resn = await request.get("/event/getAll");

    expect(resn.body).toBeTruthy();
    expect(resn.status).toBe(204);
  });

  it("Event POST /getUser null input", async () => {
    const guest = new User();

    const res = await request.post("/event/getUser").send([{
      userId: null,
      username: "Arnold",
      deviceToken: "x",
    }]);

    expect(res.body).toBeTruthy();
    expect(res.status).toBe(400);
  });

  it("Event POST /getUser error response from mongoose", async () => {
    const guest = new User();

    const res = await request.post("/event/getUser").send([{
      userId: null,
      username: "Arnold",
      deviceToken: "x",
    }]);

    expect(res.body).toBeTruthy();
    expect(res.status).toBe(400);
  });

  it("Event GET /", async () => {
    const res = await request.get("/event").send({
      eventId: "1",
    }); 

    expect(res.body).toBeTruthy();
    expect(res.status).toBe(200);
  });  
  
  it("Event POST /", async () => {

    const res = await request.post("/event").send({
      userId: "1",
      hostId: "xd",
      guestIds: [
        {guestid: "2"}
      ],
      restId: "fake restaurant",
      restName: "fake name",
      timeOfMeet: 1827192837,
    }); 

    expect(pushNotify.emit).toHaveBeenCalledTimes(1);
    expect(res.body).toBeTruthy();
    expect(res.status).toBe(502);
  }); 
  
  it("Event DELETE /", async () => {

    const res = await request.delete("/event").send({
      eventId: "69"
    }); 

    expect(res.body).toBeTruthy();
    expect(res.status).toBe(404);
  });

  it("Event PUT /", async () => {

    const res = await request.put("/event").send({
      eventId: "69",
      verifyCode: "420",
      guestId: "69420"
    }); 

    expect(res.body).toBeTruthy();
    expect(res.status).toBe(200);
  });

  it("Event POST /contactTrace", async () => {

    const res = await request.post("/event/contactTrace").send({
      userId: "69",
      twoWeeksAgo: 21312378273,
      currentDate: 21312378273
    }); 

    expect(res.body).toBeTruthy();
    expect(res.status).toBe(200);
  });
});