
const Event = require("../../models/event");
const User = require("../../models/user");
const Helpers = require("../../helper");
const mockingoose = require("mockingoose").default;


const app = require("../../app"); // Link to your server file
const supertest = require("supertest"); // supertest is a framework that allows to easily test web apis
const pushNotify = require("../../emitter");
const request = supertest(app);


describe("User Model Test", () => {

    let helper = new Helpers();
    helper.notifyHelper = jest.fn();
    const guest = new User({
        userId: "1",
        username: "Arnold",
        deviceToken: "x",
    });

    // set up mockingoose for mocking the mongoose functions
    beforeEach(() => {
        const delete1 = {
            acknolwedged: true,
            deletedCount: 1
        };
        mockingoose(User).toReturn(guest, "findOne");
        mockingoose(User).toReturn([guest], "find");
        mockingoose(User).toReturn(guest, "updateOne");
        mockingoose(User).toReturn(delete1, "deleteOne");
    });
    // make sure the call count is cleared after each test
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("User GET /", async () => {

        const res = await request.get("/user").send({
            userId: "2023290329"
        });

        expect(res.body.userId).toBe(guest.userId);
        expect(res.status).toBe(200);
    });

    it("User GET /getall", async () => {

        const res = await request.get("/user/getAll");

        expect(res.body.length).toBe(1);
        expect(res.body[0].userId).toBe(guest.userId);
        expect(res.status).toBe(200);
    });

    it("User POST /", async () => {

        const res = await request.post("/user").send({
            userId: "43",
            username: "dkljkladf",
            deviceToken: "dd",
            date: "now"
        });

        expect(res.body).toBeTruthy();
        expect(res.status).toBe(200);
    });

    it("User DELETE /", async () => {

        const res = await request.delete("/user").send({
            userId: "43",
            username: "dkljkladf",
            deviceToken: "dd",
            date: "now"
        });

        expect(res.body).toBeTruthy();
        expect(res.status).toBe(200);
    });
});

describe("User Model Test bad calls", () => {

    let helper = new Helpers();
    helper.notifyHelper = jest.fn();

    // set up mockingoose for mocking the mongoose functions
    beforeEach(() => {
        const guest = new User({
            userId: "1",
            username: "Arnold",
            deviceToken: "x",
        });
        const delete1 = {
            acknolwedged: true,
            deletedCount: 1
        };
        mockingoose(User).toReturn(guest, "findOne");
        mockingoose(User).toReturn([guest], "find");
        mockingoose(User).toReturn(guest, "updateOne");
        mockingoose(User).toReturn(delete1, "deleteOne");
    });
    // make sure the call count is cleared after each test
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("User GET / null input", async () => {

        const res = await request.get("/user").send({
            userId: null
        });

        expect(res.body).toBeTruthy();
        expect(res.status).toBe(400);
    });

    it("User GET / error response from mongoose", async () => {

        mockingoose(User).toReturn(new Error("error"), "findOne");
        const res = await request.get("/user").send({
            userId: "not null"
        });

        expect(res.body).toBeTruthy();
        expect(res.status).toBe(404);
    });

    it("User GET / null response from mongoose", async () => {

        mockingoose(User).toReturn(null, "findOne");
        const res = await request.get("/user").send({
            userId: "not null"
        });

        expect(res.body).toBeTruthy();
        expect(res.status).toBe(204);
    });

    it("User GET /getall error response from mongoose", async () => {

        mockingoose(User).toReturn(new Error("error"), "find");
        const res = await request.get("/user/getAll");

        expect(res.body).toBeTruthy();
        expect(res.status).toBe(404);
    });

    it("User GET /getall null response from mongoose", async () => {

        mockingoose(User).toReturn(null, "find");
        const res = await request.get("/user/getAll");

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

        expect(res.body).toBeTruthy();
        expect(res.status).toBe(400);
    });

    it("User POST / error response from mongoose", async () => {

        mockingoose(User).toReturn(new Error("error"), "updateOne");
        const res = await request.post("/user").send({
            userId: "not null",
            username: "dkljkladf",
            deviceToken: "dd",
            date: "now"
        });

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

        expect(res.body).toBeTruthy();
        expect(res.status).toBe(400);
    });

    it("User DELETE / error response from mongoose", async () => {

        mockingoose(User).toReturn(new Error("error"), "deleteOne");
        const res = await request.delete("/user").send({
            userId: "not null",
            username: "dkljkladf",
            deviceToken: "dd",
            date: "now"
        });

        expect(res.body).toBeTruthy();
        expect(res.status).toBe(404);
    });


    it("User DELETE / bad response from mongoose", async () => {

        mockingoose(User).toReturn(new Error("error"), "deleteOne");
        const res = await request.delete("/user").send({
            userId: "not null",
            username: "dkljkladf",
            deviceToken: "dd",
            date: "now"
        });

        expect(res.body).toBeTruthy();
        expect(res.status).toBe(404);
    });
});