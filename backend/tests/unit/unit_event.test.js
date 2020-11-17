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
  let pushNotify_stub;
  
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
    mockingoose(Event).toReturn(event, 'find');
    mockingoose(Event).toReturn(event, 'findOne');
    mockingoose(Event).toReturn(event, 'save');
    pushNotify_stub = jest.spyOn(pushNotify, 'emit');
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

    expect(pushNotify_stub).toHaveBeenCalledTimes(1);
    expect(res.body).toBeTruthy();
    expect(res.status).toBe(200);
  });
});