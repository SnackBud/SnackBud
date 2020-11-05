const Event = require('../models/event');
const User = require('../models/user');
const helpers = require('../helper');

describe('notifyNoVerifyMeetup tests', () => {

  beforeAll(() => {
    // initialize the helper class and mock the notify helper function
    helper = helpers();
    helper.notifyHelper = jest.fn();
  });

  test('notifyNewMeetup module test', () => {

    const guest = new User({
      userId: "1",
      username: "Arnold",
      deviceToken: "x"
    });

    // call notifyNewMeetup
    helper.notifyNoVerifyMeetup(guest, helper);

    // The notifyHelper should be called once
    expect(helper.notifyHelper.mock.calls.length).toBe(1);

    // The notifyHelper should be called with guest as the elem input
    expect(helper.notifyHelper.mock.calls[0][0]).toBe(guest);

    // The notifyHelper should be called with a preset string as the title input
    expect(helper.notifyHelper.mock.calls[0][1]).toBe('You have entered an invalid code!');

    // The notifyHelper should be called with a preset string as the body input
    expect(helper.notifyHelper.mock.calls[0][2]).toBe('Please try again');
  });

});

// beforeAll(() => {
//   // mock the mongoose findOne function
//   User.findOne = jest.fn().mockResolvedValue([{
//           userId: '1',
//           username: 'Arnold',
//           deviceToken: "x"
//       },
//   ]);

//   // initialize the helper class and mock the notify helper function
//   helper = new helpers();
//   helper.notifyHelper = jest.fn();
// });