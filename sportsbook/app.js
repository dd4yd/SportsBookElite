//var createError = require('http-errors');
//var express = require('express');
//var path = require('path');
//var cookieParser = require('cookie-parser');
//var logger = require('morgan');

var express = require('express')
  , path = require('path')
  , createError = require('http-errors')
  , cookieParser = require('cookie-parser')
  , logger = require('morgan')
  , routes = require('./routes')
  , router = express.Router();

var indexRouter = require('./routes/index.js');
var usersRouter = require('./routes/users');

var app = express(); // Our server that processes requests
var Mongoose = require('mongoose');
var db = Mongoose.createConnection('mongodb://root:DTZ2sa4X8Tom@localhost/admin');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);


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
  res.render('error');
});

module.exports = app;

var server = app.listen(3000,function() {
	console.log("Node server started on port 3000.");
});

