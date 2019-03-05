var createError = require('http-errors');
var express = require('express');
var path = require('path');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose'); // Used to interact with our Mongo database

var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var logoutRouter = require('./routes/logout');
var profileRouter = require('./routes/profile');
var signupRouter = require('./routes/signup');
var apiRouter = require('./routes/api');

// Set up database connection
const mongoPath = 'mongodb://root:DTZ2sa4X8Tom@127.0.0.1:27017/mydb?authSource=admin'; 
mongoose.connect(mongoPath, { useNewUrlParser: true }); // Initiate a connection to our database
mongoose.Promise = global.Promise; // Use the global promise library
const db = mongoose.connection; // Get default connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session stuff
app.use(cookieParser());
app.use(session({secret: 'SportsBookEliteSessionPass'}));
app.use(function(req, res, next) {
	res.locals.session = req.session;
	next();
});

app.use(express.static(path.join(__dirname, 'public')));

// Router setups
app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/profile', profileRouter);
app.use('/signup', signupRouter);
app.use('/api', apiRouter);

// Error handling
app.use(function(req, res, next) { // Catch 404 and forward to error handler
  next(createError(404));
});

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
