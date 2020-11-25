const userRoute = require("../../routes/user.js");
const supertest = require("supertest"); // supertest is a framework that allows to easily test web apis
const app = require("../../app");
app.use("/user", userRoute);
const request = supertest(app);

const User = require("../../models/user");

describe("testing-user-routes", () => {
    beforeAll(() => {
    });

    it("GET / - success", async () => {
        const res = await request.get("/").send({
            userId: "2023290329"
        }); //uses the request function that calls on express app instance
        expect(res.status).toEqual(200);
        expect(res.body).toEqual("home");
    });

    it("GET /user/getAll - success", async () => {
        const { body } = await request.get("/user/getAll"); //uses the request function that calls on express app instance
        expect(body).toEqual([
            {
                username: "Arnold Ying",
                userId: "109786710572605387609",
                deviceToken: "x"
            },
            {
                username: "Parsa Riahi",
                userId: "114967596096028525632",
                deviceToken: "y"
            }
        ]);
        // expect(body.statusCode).toEqual(200);
    });

    // it("GET /user/getAll - error 404", async () => {
    //     const { body } = await request.get("/users/getAll"); //uses the request function that calls on express app instance
    //     expect(body.statusCode).toEqual(404);
    // });

    it("GET /user/ - success", async () => {
        const { body } = await request.get("/user", { userId: "109786710572605387609" }); //uses the request function that calls on express app instance
        expect(body).toEqual([
            {
                userId: "1",
                username: "Arnold",
                deviceToken: "x"
            },
        ]);
        // expect(body.statusCode).toEqual(200);
    });

    it("GET /user/ - null userId", async () => {
        const { body } = await request.get("/user", { userId: null }); //uses the request function that calls on express app instance
        expect(body.statusCode).toEqual(400);
    });

    it("POST /user/ - success - same as existing user", async () => { //using a new user would cause other tests to fail, but its the same test due to the upsert keyword
        const { body } = await request.post("/user").send(
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
        const { body } = await request.post("/user");
        expect(body.statusCode).toEqual(400);
    });

    it("POST & DELETE /user/ - success - new user", async () => { // we can create a new user as long as we delete it after
        let { body } = await request.post("/user").send(
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
        let { body2 } = await request.delete("/user").send(
            {
                userId: "12345678",
            }); //uses the request function that calls on express app instance
        expect(body2).toEqual("delete successful");
        expect(body2.statusCode).toEqual(200);

        //SHOULD BE DELETED, GET ERROR CASE OF DOUBLE DELETE
        let { body23 } = await request.delete("/user").send({
            userId: "12345678",
        }); //uses the request function that calls on express app instance
        expect(body23).toEqual("already deleted");
        expect(body23.statusCode).toEqual(410);
    });

    it("DELETE /user/ - fail - bad input", async () => {
        const { body } = await request.delete("/user").send({
            userId: "12345678",
        });
        expect(body.statusCode).toEqual(400);
    });


});