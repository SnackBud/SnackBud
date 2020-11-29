// import the User model to mock the calls to database so we can test error cases
const User = require("../../models/user");
const mockingoose = require("mockingoose").default;

const app = require("../../app");
const supertest = require("supertest"); // supertest is a framework that allows to easily test web apis
const request = supertest(app);

describe("testing route GET /user", () => {
    const guest = new User({
        userId: "1",
        username: "Arnold",
        deviceToken: "x",
    });

    afterEach(() => {
        mockingoose.resetAll();
    }); 

    it("GET /user - success", async () => {
        mockingoose(User).toReturn([guest], "findOne");
        const res = await request.get("/user").send({ userId: "1" });

        expect(res.status).toBe(200);
    });

    it("GET /user - bad input", async () => {
        const res = await request.get("/user").send({ userId: null });

        expect(res.status).toBe(400);
    });

    it("GET /user - mongoose returns error", async () => {
        mockingoose(User).toReturn(new Error("error"), "findOne");
        const res = await request.get("/user").send({ userId: "1" });

        expect(res.status).toBe(404);
    });

    it("GET /user - mongoose returns null", async () => {
        mockingoose(User).toReturn(null, "findOne");
        const res = await request.get("/user").send({ userId: "1" });

        expect(res.status).toBe(204);
    });
});

describe("testing route GET /user/getAll", () => {
    const guest = new User({
        userId: "1",
        username: "Arnold",
        deviceToken: "x",
    });

    afterEach(() => {
        mockingoose.resetAll();
    }); 

    it("GET /user/getAll - success", async () => {
        mockingoose(User).toReturn([guest], "find");
        const res = await request.get("/user/getAll");

        expect(res.status).toBe(200);
    });

    it("GET /user/getAll - mongoose returns error", async () => {
        mockingoose(User).toReturn(new Error("error"), "find");
        const res = await request.get("/user/getAll");

        expect(res.status).toBe(404);
    });

    it("GET /user/getAll - mongoose returns null", async () => {
        mockingoose(User).toReturn(null, "find");
        const res = await request.get("/user/getAll");

        expect(res.status).toBe(204);
    });
});

describe("testing route POST /user", () => {
    const guest = new User({
        userId: "1",
        username: "Arnold",
        deviceToken: "x",
    });

    afterEach(() => {
        mockingoose.resetAll();
    }); 

    it("POST /user - success", async () => {
        mockingoose(User).toReturn([guest], "updateOne");
        const res = await request.post("/user").send({
            userId: "1",
            username: "Arnold",
            deviceToken: "x"
        });

        expect(res.status).toBe(200);
    });

    it("POST /user - bad input", async () => {
        const res = await request.post("/user").send({
            userId: null,
            username: "Arnold",
            deviceToken: "x"
        });

        expect(res.status).toBe(400);
    });

    it("POST /user - mongoose returns error", async () => {
        mockingoose(User).toReturn(new Error("error"), "updateOne");
        const res = await request.post("/user").send({
            userId: "1",
            username: "Arnold",
            deviceToken: "x"
        });

        expect(res.status).toBe(404);
    });
});

describe("testing route DELETE /user", () => {
    const guest = new User({
        userId: "1",
        username: "Arnold",
        deviceToken: "x",
    });

    afterEach(() => {
        mockingoose.resetAll();
    }); 

    it("DELETE /user - success", async () => {
        mockingoose(User).toReturn(guest, "deleteOne");
        const res = await request.delete("/user").send({
            userId: "1",
        });

        expect(res.status).toBe(200);
    });

    it("DELETE /user - bad input", async () => {
        const res = await request.delete("/user").send({
            userId: null,
        });

        expect(res.status).toBe(400);
    });

    it("DELETE /user - mongoose returns error", async () => {
        mockingoose(User).toReturn(new Error("error"), "deleteOne");
        const res = await request.delete("/user").send({
            userId: "1",
        });

        expect(res.status).toBe(404);
    });
});

// describe("testing route GET /user/getAll", () => {
//     const guest = new User({
//         userId: "1",
//         username: "Arnold",
//         deviceToken: "x",
//     });

//     beforeEach(() => {
//         mockingoose.resetAll();
//     }); 

//     it("GET /user/ - success", async () => {
//         const res = await request.get("/user", { userId: "109786710572605387609" }); //uses the request function that calls on express app instance
//         expect(res.body).toEqual([
//             {
//                 userId: "1",
//                 username: "Arnold",
//                 deviceToken: "x"
//             },
//         ]);
//         // expect(body.statusCode).toEqual(200);
//     });

//     it("GET /user/ - null userId", async () => {
//         const res = await request.get("/user", { userId: null }); //uses the request function that calls on express app instance
//         expect(res.body.statusCode).toEqual(400);
//     });

//     it("POST /user/ - success - same as existing user", async () => { //using a new user would cause other tests to fail, but its the same test due to the upsert keyword
//         const res = await request.post("/user").send(
//             {
//                 username: "Arnold Ying",
//                 date: "2020-11-03T02:33:32.515Z",
//                 userId: "109786710572605387609",
//                 deviceToken: "exRsy5QSRlKCK9LMJQUI0t:APA91bHPfk9D8rK3OLsR2Xxp12PUDrLr9MyjSYFYt65PWDomNLHJlTeb4WnGucis63csf4RoK8-ClpPx1rWjXVfwxt-6a88xMk1UtamEj4uknu41eidqA3kRMFkKHG27Hfl2f0CW9wAt"
//             }); //uses the request function that calls on express app instance
//         expect(res.body).toEqual([
//             {
//                 username: "Arnold Ying",
//                 date: "2020-11-03T02:33:32.515Z",
//                 _id: "5f9630e9a6f16e0a31a2a565",
//                 userId: "109786710572605387609",
//                 __v: 0,
//                 deviceToken: "exRsy5QSRlKCK9LMJQUI0t:APA91bHPfk9D8rK3OLsR2Xxp12PUDrLr9MyjSYFYt65PWDomNLHJlTeb4WnGucis63csf4RoK8-ClpPx1rWjXVfwxt-6a88xMk1UtamEj4uknu41eidqA3kRMFkKHG27Hfl2f0CW9wAt"
//             },
//         ]);
//         expect(res.body.statusCode).toEqual(201);
//     });

//     it("POST /user/ - fail - bad input", async () => { //using a new user would cause other tests to fail, but its the same test due to the upsert keyword
//         const res = await request.post("/user");
//         expect(res.body.statusCode).toEqual(400);
//     });

//     it("POST & DELETE /user/ - success - new user", async () => { // we can create a new user as long as we delete it after
//         const res1 = await request.post("/user").send(
//             {
//                 username: "I should be deleted soon",
//                 date: "2020-11-03T02:33:32.515Z",
//                 userId: "12345678",
//                 deviceToken: "111"
//             }); //uses the request function that calls on express app instance
//         expect(res1.body).toEqual([
//             {
//                 username: "I should be deleted soon",
//                 date: "2020-11-03T02:33:32.515Z",
//                 userId: "12345678",
//                 deviceToken: "111"
//             },
//         ]);
//         expect(res1.body.statusCode).toEqual(201);

//         //DELETE ONCE
//         const res2 = await request.delete("/user").send(
//             {
//                 userId: "12345678",
//             }); //uses the request function that calls on express app instance
//         expect(res2.body).toEqual("delete successful");
//         expect(res2.body.statusCode).toEqual(200);

//         //SHOULD BE DELETED, GET ERROR CASE OF DOUBLE DELETE
//         const res3 = await request.delete("/user").send({
//             userId: "12345678",
//         }); //uses the request function that calls on express app instance
//         expect(res3.body).toEqual("already deleted");
//         expect(res3.body.statusCode).toEqual(410);
//     });

//     it("DELETE /user/ - fail - bad input", async () => {
//         const res = await request.delete("/user").send({
//             userId: "12345678",
//         });
//         expect(res.body.statusCode).toEqual(400);
//     });


// });