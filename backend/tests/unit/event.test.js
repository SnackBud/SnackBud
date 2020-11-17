const Event = require("../../models/event");
const User = require("../../models/user");
const Helpers = require("../../helper");
const admin = require("firebase-admin");
const mockingoose = require('mockingoose').default;


describe("notifyHelper tests", () => {
  let helper = new Helpers();

  // mock the firebase admin class called by the helper
  let send_stub = jest.spyOn(admin.messaging(), "send");
  let message_stub = jest.spyOn(admin, "messaging");

  // make sure the call count is cleared after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("notifyHelper simple call", () => {
    // input
    const guest = new User({
      userId: "1",
      username: "Arnold",
      deviceToken: "x",
    });
    const title = "this is the title";
    const body = "this is the body";

    // expected input to admin.messaging().send()
    const message = {
      notification: {
        title,
        body,
      },
      token: guest.deviceToken,
    }; 

    // call notifyHelper
    helper.notifyHelper(guest, title, body);

    // admin.messaging().send() checks
    expect(message_stub).toHaveBeenCalledTimes(1); 
    expect(send_stub).toHaveBeenCalledTimes(1); 
    expect(send_stub).toHaveBeenCalledWith(message);
  });
  
  it("notifyHelper bad call", () => {
    // input
    const guest = null
    const title = "this is the title";
    const body = "this is the body";

    // call notifyHelper
    helper.notifyHelper(guest, title, body);

    // admin.messaging().send() should not be called
    expect(message_stub).toHaveBeenCalledTimes(0); 
    expect(send_stub).toHaveBeenCalledTimes(0); 
  });
});