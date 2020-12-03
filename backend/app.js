//do nodemon www to start backend. there is a www.js file in bin
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cors = require('cors');
var mongoose = require('mongoose');       //Helps connect to mongodb database
//require('mongoose-type-email');

require('dotenv').config();
var uri = process.env.MONGO_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

const connection = mongoose.connection;
connection.once('open', () => { console.log("MongoDb database connected!"); })

var listingsRouter = require('./routes/listings');
var userRouter = require('./routes/users');
var emailRouter = require('./routes/email');

var app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); 
// Might Elimate code line above, or find a way to use it as image hosting?????

app.use('/listings', listingsRouter);
app.use('/users', userRouter);
app.use('/email', emailRouter);
//app.use('/login', login);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
});

module.exports = app;
