const Event = require("../../models/event");
const User = require("../../models/user");
const Helpers = require("../../helper");
const admin = require("firebase-admin");
const mockingoose = require("mockingoose").default;


describe("notifyHelper tests", () => {
  let helper = new Helpers();
  let sendStub, messageStub;

  beforeEach(() => {
    // mock the firebase admin class called by the helper
    sendStub = jest.spyOn(admin.messaging(), "send");
    messageStub = jest.spyOn(admin, "messaging");
  });

  // make sure the call count is cleared after each test
  afterEach(() => {
    jest.clearAllMocks();
    sendStub.mockRestore();
    messageStub.mockRestore();
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
    expect(messageStub).toHaveBeenCalledTimes(1); 
    expect(sendStub).toHaveBeenCalledTimes(1); 
    expect(sendStub).toHaveBeenCalledWith(message);
  });
  
  it("notifyHelper bad call", () => {
    // input
    const guest = null;
    const title = "this is the title";
    const body = "this is the body";

    // call notifyHelper
    helper.notifyHelper(guest, title, body);

    // admin.messaging().send() should not be called
    expect(messageStub).toHaveBeenCalledTimes(0); 
    expect(sendStub).toHaveBeenCalledTimes(0); 
  });
});


describe("notifyNewMeetup tests", () => {
  let helper = new Helpers();
  helper.notifyHelper = jest.fn();
  
  // set up mockingoose for mocking the mongoose functions
  beforeAll(() => {
    const guest = new User({
      userId: "1",
      username: "Arnold",
      deviceToken: "x",
    });
    mockingoose(User).toReturn(guest, "findOne");
  });

  afterAll(() => {  
    mockingoose.resetAll();
  });

  // make sure the call count is cleared after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("notifyNewMeetup simple call", () => {
    // input
    const event = new Event({
      hostId: "1",
      guestIds: [
        {guestId: "2"},
        {guestId: "3"}
      ]
    });

    // call notifyHelper
    helper.notifyNewMeetup(event);

    // the notify helper should be called for each guest + the host
    expect(helper.notifyHelper).toHaveBeenCalledTimes(event.guestIds.length + 1); 
  });
  
  it("notifyNewMeetup bad call", () => {
    // inputs
    const nullEvent = null;
    const noHostEvent = new Event({
      guestIds: [
        {guestId: "2"},
        {guestId: "3"}
      ]
    });
    const noGuestEvent = new Event({
      hostId: "1"
    });

    // call notifyNewMeetup with null
    helper.notifyNewMeetup(nullEvent);

    // call notifyNewMeetup with undefined
    helper.notifyNewMeetup();

    // call notifyNewMeetup with event without guests
    helper.notifyNewMeetup(noGuestEvent);

    // call notifyNewMeetup with event without host
    helper.notifyNewMeetup(noHostEvent);

    // notifyHelper should not be called
    expect(helper.notifyHelper).toHaveBeenCalledTimes(0); 
  });
});


describe("notifyVerifyMeetup tests", () => {
  
  // set up the helper class and mock the notifyHelper function
  let helper = new Helpers();
  helper.notifyHelper = jest.fn();
  
  // set up mockingoose for mocking the mongoose functions
  beforeEach(() => {
    const guest = new User({
      userId: "1",
      username: "Arnold",
      deviceToken: "x",
    });
    mockingoose(User).toReturn(guest, "findOne");
  });

  afterAll(() => {  
    mockingoose.resetAll();
  });

  // make sure the call count is cleared after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("notifyVerifyMeetup simple call", () => {
    // input
    const event = new Event({
      hostId: "1",
      guestIds: [
        {guestId: "2"},
        {guestId: "3"}
      ],
      restName: "The Nest"
    });

    const guest = new User({
      userId: "2",
      username: "Arnold",
      deviceToken: "x"
    });

    // call notifyHelper
    helper.notifyVerifyMeetup(event, guest);

    // the notify helper should be called for each guest + the host
    expect(helper.notifyHelper).toHaveBeenCalledTimes(2); 
  });

  it("notifyVerifyMeetup same host and guest call", () => {
    // input
    const event = new Event({
      hostId: "1",
      guestIds: [
        {guestId: "2"},
        {guestId: "3"}
      ],
      restName: "The Nest"
    });

    const guest = new User({
      userId: "1",
      username: "Arnold",
      deviceToken: "x"
    });

    // call notifyHelper
    helper.notifyVerifyMeetup(event, guest);

    // the notify helper should be called for each guest + the host
    expect(helper.notifyHelper).toHaveBeenCalledTimes(1); 
  });

  it("notifyVerifyMeetup bad call", () => {
    // inputs
    const nullEvent = null;
    const nullGuest = null;
    const event = new Event({
      hostId: "1",
      guestIds: [
        {guestId: "2"},
        {guestId: "3"}
      ],
      restName: "The Nest"
    });

    const guest = new User({
      userId: "1",
      username: "Arnold",
      deviceToken: "x"
    });
    // call notifyNewMeetup with null event and guest
    helper.notifyVerifyMeetup(nullEvent, nullGuest);

    // call notifyNewMeetup with a defined event and null guest
    helper.notifyVerifyMeetup(event, nullGuest);

    // notifyHelper should not be called
    expect(helper.notifyHelper).toHaveBeenCalledTimes(0); 
    
    
    mockingoose(User).toReturn(new Error("error"), "findOne");
    
    helper.notifyVerifyMeetup(event, guest);
  });
});


describe("notifyNoVerifyMeetup tests", () => {

  // initialize the helper class and mock the notify helper function
  let helper = new Helpers();
  helper.notifyHelper = jest.fn();

  // make sure the call count is cleared after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("notifyNoVerifyMeetup simple call", () => {
    const guest = new User({
      userId: "1",
      username: "Arnold",
      deviceToken: "x",
    });

    // call notifyNewMeetup
    helper.notifyNoVerifyMeetup(guest, helper);

    // notifyHelper checks
    expect(helper.notifyHelper).toHaveBeenCalledTimes(1);
    expect(helper.notifyHelper).toHaveBeenCalledWith(guest, 
      "You have failed to verify this meetup!",
      "Either your verify code is wrong or you are the host! Please try again"
    );
  });

  it("notifyNoVerifyMeetup undefined guest call", () => {
    const guest = null;

    // call notifyNewMeetup
    helper.notifyNoVerifyMeetup(guest, helper);

    // notify helper should not be called
    expect(helper.notifyHelper).toHaveBeenCalledTimes(0);
  });
});


describe("notifyEnterCode tests", () => {
  
  // set up the helper class and mock the notifyHelper function
  let helper = new Helpers();
  helper.notifyHelper = jest.fn();
  
  // set up mockingoose for mocking the mongoose functions
  beforeEach(() => {
    const guest = new User({
      userId: "1",
      username: "Arnold",
      deviceToken: "x",
    });
    mockingoose(User).toReturn(guest, "findOne");
  });

  afterAll(() => {  
    mockingoose.resetAll();
  });

  // make sure the call count is cleared after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("notifyEnterCode simple call", () => {
    const event = new Event({
      hostId: "1",
      guestIds: [
        {guestId: "2"},
        {guestId: "3"}
      ],
      restName: "The Nest"
    });

    // call notifyNewMeetup
    helper.notifyEnterCode(event);

    // notifyHelper checks
    expect(helper.notifyHelper).toHaveBeenCalledTimes(event.guestIds.length + 1);
  });

  it("notifyEnterCode bad call", () => {
    const nullEvent = null;
    // call notifyNewMeetup
    helper.notifyEnterCode(nullEvent);

    // notify helper should not be called
    expect(helper.notifyHelper).toHaveBeenCalledTimes(0);

    
    // error return from User.findone
    mockingoose(User).toReturn(new Error("error"), "findOne");
    const event = new Event({
      hostId: "1",
      guestIds: [
        {guestId: "2"},
        {guestId: "3"}
      ],
      restName: "The Nest"
    });
    helper.notifyEnterCode(event);
    expect(helper.notifyHelper).toHaveBeenCalledTimes(0);
  });
});