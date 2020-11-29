const mongoose = require("mongoose");
require("dotenv/config");

// connect to db
mongoose.connect(process.env.DB_CONNECTION,
    { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    });