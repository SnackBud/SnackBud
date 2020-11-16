// const express = require("express"); // import express
// const request = require("supertest"); // supertest is a framework that allows to easily test web apis

// const userRoute = require("../routes/user.js");
// const eventRoute = require("../routes/event.js");

// const app = express(); //an instance of an express app, a 'fake' express app
// app.use("/event", eventRoute);

// describe("testing-event-routes", () => {
//     it("GET / - success", async () => {
//         const { body } = await request(app).get("/"); //uses the request function that calls on express app instance
//         expect(body).toEqual("home");
//         expect(body.statusCode).toEqual(200);
//     });


// });