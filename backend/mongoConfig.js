const mongoose = require("mongoose");

// connect to db
mongoose.connect(process.env.DB_CONNECTION,
    { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));