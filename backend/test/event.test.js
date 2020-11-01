const Event = require('../models/event')
const User = require('../models/user')
const {pushNotify, notifyNewMeetup} = require('../emitter')

describe('notifyNewMeetup tests', () => {

  beforeAll(() => {
    User.findOne = jest.fn().mockResolvedValue([{
            userId: '1',
            username: 'Arnold',
        },
    ]);
  });

  test('notifyNewMeetup module test', () => {

    const event = new Event({
      eventId: "r" + "1000" + "h" + "1000" + "t" + "1000",
      hostId: "1",
      guestIds: [{guestId: "2"},
                 {guestId: "3"}],
      restId: "1000",
      restName: "Chipotle",
      timeOfMeet: "16940",
    });
  
    // also mock the User mongoose db
    const resp = {userId: "1", deviceToken: "x"};
    User.findOne.mockResolvedValue(resp);
  
    notifyNewMeetup(event);
  });

});

