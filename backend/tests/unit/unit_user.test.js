// mongoose model for the routes we are testing
const User = require("../../models/user");

// We use the module mockingoose to mock mongoose functions
const mockingoose = require("mockingoose").default;

// Set up a testing express app
const express = require("express"); 
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
const userRoute = require("../../routes/user.js");
app.use("/user", userRoute);

// Set up supertest to test the user routes module
const supertest = require("supertest"); // supertest is a framework that allows to easily test web apis
const request = supertest(app);


describe("User Model Test", () => {
    const guest = new User({
        userId: "1",
        username: "Arnold",
        deviceToken: "x",
    });

    // set up mockingoose for mocking the mongoose functions
    beforeEach(() => {
        mockingoose.resetAll();
        mockingoose(User).toReturn(guest, "findOne");
        mockingoose(User).toReturn([guest], "find");
        mockingoose(User).toReturn(guest, "updateOne");
        mockingoose(User).toReturn(null, "deleteOne");
    });
    // make sure the call count is cleared after each test
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("User GET /", async () => {

        const res = await request.get("/user").send({
            userId: "2023290329"
        });

        // this endpoint calls the mongoose findOne function
        // we've mocked it to return the preset guest variable
        expect(res.body.userId).toBe(guest.userId);
        expect(res.status).toBe(200);
    });

    it("User GET /getall", async () => {

        const res = await request.get("/user/getAll");

        // this endpoint calls the mongoose find function
        // we've mocked it to return an array of one element
        // containing the preset guest variable
        expect(res.body.length).toBe(1);
        expect(res.body[0].userId).toBe(guest.userId);
        expect(res.status).toBe(200);
    });

    it("User POST /", async () => {
        const res = await request.post("/user").send({
            userId: "43",
            username: "dkljkladf",
            deviceToken: "dd",
        });

        // this endpoint calls the mongoose updateOne function
        // the endpoint returns the user object it calls the 
        // updateOne function with
        expect(res.body.userId).toBe("43");
        expect(res.body.username).toBe("dkljkladf");
        expect(res.body.deviceToken).toBe("dd");
        expect(res.status).toBe(200);
    });

    it("User DELETE /", async () => {
        const res = await request.delete("/user").send({
            userId: "43",
            username: "dkljkladf",
            deviceToken: "dd",
            date: "now"
        });

        // this endpoint calls the mongoose updateOne function
        // the endpoint returns "delete successful" on success
        expect(res.body).toBe("delete successful");
        expect(res.status).toBe(200);
    });
});

describe("User Model Test bad calls", () => {

    // set up mockingoose for mocking the mongoose functions
    beforeEach(() => {
        const guest = new User({
            userId: "1",
            username: "Arnold",
            deviceToken: "x",
        });
        mockingoose(User).toReturn(guest, "findOne");
        mockingoose(User).toReturn([guest], "find");
        mockingoose(User).toReturn(guest, "updateOne");
        mockingoose(User).toReturn(null, "deleteOne");
    });
    // make sure the call count is cleared after each test
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("User GET / null input", async () => {

        const res = await request.get("/user").send({
            userId: null
        });

        // this endpoint returns "bad input" if the input
        // is null / invalid
        expect(res.body).toBe("bad input");
        expect(res.status).toBe(400);
    });

    it("User GET / error response from mongoose", async () => {

        // mock the mongoose function to return an error
        mockingoose(User).toReturn(new Error("error message"), "findOne");
        const res = await request.get("/user").send({
            userId: "not null"
        });

        // this endpoint returns the 404 status if mongoose function had an error
        expect(res.body).toBeTruthy();
        expect(res.status).toBe(404);
    });

    it("User GET / null response from mongoose", async () => {

        // mock the mongoose function to return null
        mockingoose(User).toReturn(null, "findOne");
        const res = await request.get("/user").send({
            userId: "not null"
        });

        // this endpoint returns 204 status if mongoose function returns null
        expect(res.body).toBeTruthy();
        expect(res.status).toBe(204);
    });

    it("User GET /getall error response from mongoose", async () => {

        // mock the mongoose function to return error
        mockingoose(User).toReturn(new Error("error"), "find");
        const res = await request.get("/user/getAll");

        // this endpoint returns the 404 status if mongoose function had an error
        expect(res.body).toBeTruthy();
        expect(res.status).toBe(404);
    });

    it("User GET /getall null response from mongoose", async () => {

        // mock the mongoose function to return null
        mockingoose(User).toReturn(null, "find");
        const res = await request.get("/user/getAll");

        // this endpoint returns 204 status if mongoose function returns null
        expect(res.body).toBeTruthy();
        expect(res.status).toBe(204);
    });

    it("User POST / null input", async () => {

        const res = await request.post("/user").send({
            userId: null,
            username: "dkljkladf",
            deviceToken: "dd",
            date: "now"
        });

        // this endpoint returns "bad input" if the input
        // is null / invalid
        expect(res.body).toBe("bad input");
        expect(res.status).toBe(400);
    });

    it("User POST / error response from mongoose", async () => {

        // mock the mongoose function to return error
        mockingoose(User).toReturn(new Error("error"), "updateOne");
        const res = await request.post("/user").send({
            userId: "not null",
            username: "dkljkladf",
            deviceToken: "dd",
            date: "now"
        });

        // this endpoint returns the 404 status if mongoose function had an error
        expect(res.body).toBeTruthy();
        expect(res.status).toBe(404);
    });

    it("User DELETE / null input", async () => {

        const res = await request.delete("/user").send({
            userId: null,
            username: "dkljkladf",
            deviceToken: "dd",
            date: "now"
        });

        // this endpoint returns "bad input" if the input
        // is null / invalid
        expect(res.body).toBe("bad input");
        expect(res.status).toBe(400);
    });

    it("User DELETE / error response from mongoose", async () => {

        // mock the mongoose function to return error
        mockingoose(User).toReturn(new Error("error"), "deleteOne");
        const res = await request.delete("/user").send({
            userId: "not null",
            username: "dkljkladf",
            deviceToken: "dd",
            date: "now"
        });

        // this endpoint returns the 404 status if mongoose function had an error
        expect(res.body).toBeTruthy();
        expect(res.status).toBe(404);
    });
});