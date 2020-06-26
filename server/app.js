const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors');
const path = require('path');

const logger = require('./utils/logger');
const auth = require('./middleware/auth');
const apiRoutes = require('./routes/api');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Pseudo code
// app.use(auth);

// Routes
// CORS: per ora abilito tutto, di solito si una una whitelist
app.use(cors())

app.use('/api', apiRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  logger('server', err.message);

  // render the error page
  res.status(err.status || 500);
  res.send('error');
});

module.exports = app;
