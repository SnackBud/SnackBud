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
    mockingoose(User).toReturn(guest, 'findOne');
  });

  afterAll(() => {  
    mockingoose.resetAll();
  })

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
    const null_event = null;
    const no_host_event = new Event({
      guestIds: [
        {guestId: "2"},
        {guestId: "3"}
      ]
    });
    const no_guest_event = new Event({
      hostId: "1"
    });

    // call notifyNewMeetup with null
    helper.notifyNewMeetup(null_event);

    // call notifyNewMeetup with undefined
    helper.notifyNewMeetup();

    // call notifyNewMeetup with event without guests
    helper.notifyNewMeetup(no_guest_event);

    // call notifyNewMeetup with event without host
    helper.notifyNewMeetup(no_host_event);

    // notifyHelper should not be called
    expect(helper.notifyHelper).toHaveBeenCalledTimes(0); 
  });
});


describe("notifyVerifyMeetup tests", () => {
  
  // set up the helper class and mock the notifyHelper function
  let helper = new Helpers();
  helper.notifyHelper = jest.fn();
  
  // set up mockingoose for mocking the mongoose functions
  beforeAll(() => {
    const guest = new User({
      userId: "1",
      username: "Arnold",
      deviceToken: "x",
    });
    mockingoose(User).toReturn(guest, 'findOne');
  });

  afterAll(() => {  
    mockingoose.resetAll();
  })

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
    const null_event = null;
    const null_guest = null;
    const event = new Event({
      hostId: "1",
      guestIds: [
        {guestId: "2"},
        {guestId: "3"}
      ],
      restName: "The Nest"
    });

    // call notifyNewMeetup with null event and guest
    helper.notifyVerifyMeetup(null_event, null_guest);

    // call notifyNewMeetup with a defined event and null guest
    helper.notifyVerifyMeetup(event, null_guest);

    // notifyHelper should not be called
    expect(helper.notifyHelper).toHaveBeenCalledTimes(0); 
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
    const guest = null

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
  beforeAll(() => {
    const guest = new User({
      userId: "1",
      username: "Arnold",
      deviceToken: "x",
    });
    mockingoose(User).toReturn(guest, 'findOne');
  });

  afterAll(() => {  
    mockingoose.resetAll();
  })

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
    const null_event = null

    // call notifyNewMeetup
    helper.notifyEnterCode(null_event);

    // notify helper should not be called
    expect(helper.notifyHelper).toHaveBeenCalledTimes(0);
  });
});