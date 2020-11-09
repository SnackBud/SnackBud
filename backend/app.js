const express = require('express');

const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv/config');
const winston = require('winston')
const consoleTransport = new winston.transports.Console()
const myWinstonOptions = {
  transports: [consoleTransport]
}
const logger = new winston.createLogger(myWinstonOptions)

function logRequest(req, res, next) {
  logger.info(req.url)
  next()
}
app.use(logRequest)

function logError(err, req, res, next) {
  logger.error(err)
  next()
}
app.use(logError)

app.use(bodyParser.json());

// const router = express.Router();

// import routes
const userRoute = require('./routes/user.js');
const eventRoute = require('./routes/event.js');

app.use('/user', userRoute);
app.use('/event', eventRoute);

app.get('/', (req, res) => {
  res.send('home');
  // console.log("home accessed");
});

// connect to db
mongoose.connect(process.env.DB_CONNECTION,
  { useNewUrlParser: true, useUnifiedTopology: true }, () => {
  // console.log('connected to db');
  });

// listen on port 3000
app.listen(3000);

module.exports = app;
