const Event = require("../models/event");
const User = require("../models/user");
const Helpers = require("../helper");

/* global jest.fn, a */
/* eslint no-undef: "error" */

describe("User route tests", () => {
    let user;
    beforeAll(() => {
        // initialize the helper class and mock the notify helper function
        user = new User();
        user.find = jest.fn();
    });

    test("notifyNewMeetup module test", () => {
        const guest = new User({
            userId: "1",
            // username: "Arnold",
            // deviceToken: "x",
        });

        // call notifyNewMeetup
        user.get(guest, user);

        // The notifyHelper should be called once
        expect(user.notifyHelper.mock.calls.length).toBe(1);

        // The notifyHelper should be called with guest as the elem input
        expect(user.notifyHelper.mock.calls[0][0]).toBe(guest);

        // The notifyHelper should be called with a preset string as the title input
        expect(user.notifyHelper.mock.calls[0][1]).toBe("You have entered an invalid code!");

        // The notifyHelper should be called with a preset string as the body input
        expect(user.notifyHelper.mock.calls[0][2]).toBe("Please try again");
    });
});
