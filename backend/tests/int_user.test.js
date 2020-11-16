const express = require("express"); // import express
const request = require("supertest"); // supertest is a framework that allows to easily test web apis

const userRoute = require("../routes/user.js");
const eventRoute = require("../routes/event.js");

const app = express(); //an instance of an express app, a 'fake' express app
app.use("/user", userRoute);


describe("testing-user-routes", () => {
    it("GET / - success", async () => {
        const { body } = await request(app).get("/"); //uses the request function that calls on express app instance
        expect(body).toEqual("home");
        expect(body.statusCode).toEqual(200);
    });

    it("GET /user/getAll - success", async () => {
        const { body } = await request(app).get("/user/getAll"); //uses the request function that calls on express app instance
        expect(body).toEqual([
            {
                username: "Arnold Ying",
                date: "2020-11-03T02:33:32.515Z",
                _id: "5f9630e9a6f16e0a31a2a565",
                userId: "109786710572605387609",
                __v: 0,
                deviceToken: "exRsy5QSRlKCK9LMJQUI0t:APA91bHPfk9D8rK3OLsR2Xxp12PUDrLr9MyjSYFYt65PWDomNLHJlTeb4WnGucis63csf4RoK8-ClpPx1rWjXVfwxt-6a88xMk1UtamEj4uknu41eidqA3kRMFkKHG27Hfl2f0CW9wAt"
            },
            {
                username: "Parsa Riahi",
                date: "2020-10-28T18:10:36.254Z",
                _id: "5f963568a6f16e0a31a35277",
                userId: "114967596096028525632",
                __v: 0,
                deviceToken: "dcbWfSmiS4yMNDfsts5NlG:APA91bGJprIQ9BnVhyB-maehucerx_24YgIGRrQB-M54sWzBT5zkzif6MHAeFSrMwKoywFYmkNuNGVp61DeKBNikIcBV2bQ4FPxuSxUX9bPciQnCkCOOkShIv1ScADUUFgYRIcuqaymX"
            },
            {
                username: "sanjeev krishnan",
                date: "2020-11-10T08:38:58.805Z",
                _id: "5f965262a6f16e0a31a8b78d",
                userId: "116641537845528174870",
                __v: 0,
                deviceToken: "e9g3sGKvQjy-4SIaTrlEvX:APA91bHyHLps6myesRTqKfy3VYHPsF6xO5CM-W_O36TxYOYqzKcg_EHovbf-xrI7jcZN-Fo8apb5EFvcmLMxJzxsdPTzLoxG0jtM5kzkwUCioaGWCY6BohdxGk40jc8ruWlSWG15Z8vS"
            },
            {
                username: "Rain Zhang",
                date: "2020-10-27T05:47:09.135Z",
                _id: "5f966360a6f16e0a31ab0d3d",
                userId: "105664700188784427014",
                __v: 0,
                deviceToken: "fIV29yIIScW2zH69FiCUa0:APA91bHsi6zdBWFBsiiSPinozT3JoWCz9ozg25UVwx5xbSU6md_wW_-I6iIpZpXTyjjKq_0J2ARXuplW2SzL0FgKvYmzNNGrTXIorB89W-p4dpoBowV6XannKfMpuY0bT1LYLffrXHM7"
            },
            {
                username: "cpen321 test",
                date: "2020-10-28T20:39:18.526Z",
                _id: "5f9a6ca7a6f16e0a313d3b69",
                userId: "108956686198345665190",
                __v: 0,
                deviceToken: "dfvQebATSvOHWEbwckiRMk:APA91bGLe-A6MlwRgba9L1SUGKuJF7EnSPg2EDN-z_7rqY3coAckJNHjh9vE3E7mE3jCcsrZA5An2h_gR0IvQhHelWULM8udtnYCnZKHThN10Ojs6aR7NJGJD0W805mtNtfOz0-kQOcC"
            }
        ]);
        expect(body.statusCode).toEqual(200);
    });

    it("GET /user/getAll - error 404", async () => {
        const { body } = await request(app).get("/users/getAll"); //uses the request function that calls on express app instance
        expect(body.statusCode).toEqual(404);
    });

    it("GET /user/ - success", async () => {
        const { body } = await request(app).get("/user", { userId: "109786710572605387609" }); //uses the request function that calls on express app instance
        expect(body).toEqual([
            {
                username: "Arnold Ying",
                date: "2020-11-03T02:33:32.515Z",
                _id: "5f9630e9a6f16e0a31a2a565",
                userId: "109786710572605387609",
                __v: 0,
                deviceToken: "exRsy5QSRlKCK9LMJQUI0t:APA91bHPfk9D8rK3OLsR2Xxp12PUDrLr9MyjSYFYt65PWDomNLHJlTeb4WnGucis63csf4RoK8-ClpPx1rWjXVfwxt-6a88xMk1UtamEj4uknu41eidqA3kRMFkKHG27Hfl2f0CW9wAt"
            },
        ]);
        expect(body.statusCode).toEqual(200);
    });

    it("GET /user/ - fail", async () => {
        const { body } = await request(app).get("/user", { userId: "testvalue" }); //uses the request function that calls on express app instance
        expect(body).toEqual(null);
    });

    it("GET /user/ - null userId", async () => {
        const { body } = await request(app).get("/user", { userId: null }); //uses the request function that calls on express app instance
        expect(body.statusCode).toEqual(400);
    });

    it("GET /user/ - error 404", async () => {
        const { body } = await request(app).get("/users", { userId: "testvalue" }); //uses the request function that calls on express app instance
        expect(body.statusCode).toEqual(404);
    });

    it("POST /user/ - success - same as existing user", async () => { //using a new user would cause other tests to fail, but its the same test due to the upsert keyword
        const { body } = await request(app).post("/user",
            {
                username: "Arnold Ying",
                date: "2020-11-03T02:33:32.515Z",
                userId: "109786710572605387609",
                deviceToken: "exRsy5QSRlKCK9LMJQUI0t:APA91bHPfk9D8rK3OLsR2Xxp12PUDrLr9MyjSYFYt65PWDomNLHJlTeb4WnGucis63csf4RoK8-ClpPx1rWjXVfwxt-6a88xMk1UtamEj4uknu41eidqA3kRMFkKHG27Hfl2f0CW9wAt"
            }); //uses the request function that calls on express app instance
        expect(body).toEqual([
            {
                username: "Arnold Ying",
                date: "2020-11-03T02:33:32.515Z",
                _id: "5f9630e9a6f16e0a31a2a565",
                userId: "109786710572605387609",
                __v: 0,
                deviceToken: "exRsy5QSRlKCK9LMJQUI0t:APA91bHPfk9D8rK3OLsR2Xxp12PUDrLr9MyjSYFYt65PWDomNLHJlTeb4WnGucis63csf4RoK8-ClpPx1rWjXVfwxt-6a88xMk1UtamEj4uknu41eidqA3kRMFkKHG27Hfl2f0CW9wAt"
            },
        ]);
        expect(body.statusCode).toEqual(201);
    });

    it("POST /user/ - fail - bad input", async () => { //using a new user would cause other tests to fail, but its the same test due to the upsert keyword
        const { body } = await request(app).post("/user");
        expect(body.statusCode).toEqual(400);
    });

    it("POST & DELETE /user/ - success - new user", async () => { // we can create a new user as long as we delete it after
        const { body } = await request(app).post("/user",
            {
                username: "I should be deleted soon",
                date: "2020-11-03T02:33:32.515Z",
                userId: "12345678",
                deviceToken: "111"
            }); //uses the request function that calls on express app instance
        expect(body).toEqual([
            {
                username: "I should be deleted soon",
                date: "2020-11-03T02:33:32.515Z",
                userId: "12345678",
                deviceToken: "111"
            },
        ]);
        expect(body.statusCode).toEqual(201);

        //DELETE ONCE
        const { body } = await request(app).delete("/user",
            {
                userId: "12345678",
            }); //uses the request function that calls on express app instance
        expect(body).toEqual("delete successful");
        expect(body.statusCode).toEqual(200);

        const { body } = await request(app).get("/user", { userId: 12345678 }); //uses the request function that calls on express app instance
        expect(body.statusCode).toEqual(204);

        //SHOULD BE DELETED, GET ERROR CASE OF DOUBLE DELETE
        const { body } = await request(app).delete("/user",
            {
                userId: "12345678",
            }); //uses the request function that calls on express app instance
        expect(body).toEqual("already deleted");
        expect(body.statusCode).toEqual(410);
    });

    it("DELETE /user/ - fail - bad input", async () => {
        const { body } = await request(app).delete("/user");
        expect(body.statusCode).toEqual(400);
    });


});

describe("Integration test- user creates a meetup", () => {
    let user;
    beforeAll(() => {
        // initialize the helper class and mock the notify helper function
        user = new User();
        // user.find = jest.fn();
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

describe("Integration test- user verifies a meetup", () => {
    // let user;
    beforeAll(() => {
        // initialize the helper class and mock the notify helper function
        // user = new User();
        // user.find = jest.fn();
    });

    test("notifyNewMeetup module test", () => {
        // const guest = new User({
        //     userId: "1",
        //     // username: "Arnold",
        //     // deviceToken: "x",
        // });

    });
});



describe("Integration test- user reports covid symtoms", () => {
    // let user;
    beforeAll(() => {
        // initialize the helper class and mock the notify helper function
        // user = new User();
        // user.find = jest.fn();
    });

    test("notifyNewMeetup module test", () => {
        // const guest = new User({
        //     userId: "1",
        //     // username: "Arnold",
        //     // deviceToken: "x",
        // });

    });
});

/*expect(body).toEqual([
            {
                state: "NJ",
                capital: "Trenton",
                governor: "Phil Murphy",
            },
            {
                state: "CT",
                capital: "Hartford",
                governor: "Ned Lamont",
            },
            {
                state: "NY",
                capital: "Albany",
                governor: "Andrew Cuomo",
            },
        ]);
        */