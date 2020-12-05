var createError = require('http-errors');
var express = require('express');
var path = require('path');
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bcrypt = require("bcryptjs");
require("dotenv").config();

var app = express();

//Set up mongoose connection
var mongoose = require('mongoose');
var mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true, useFindAndModify: false});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const User = require("./models/user");


// passport.js
passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }
      bcrypt.compare(password, user.password, (err, res) => {
          if (res) { // passwords match
              return done(null, user);
          } else { // passwords don't match
              return done(null, false);
          }
      }); 
    });
  })
);


app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

//locals
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    //console.log(res.locals.currentUser);

    next();
});

// routers
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const homeRouter = require("./routes/home");
const postRouter = require("./routes/post");


app.use('/', indexRouter);

// Auth
app.use((req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect("/login");
});

app.use('/home', homeRouter);
app.use("/clubhouse", postRouter);
app.use('/users', usersRouter);

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
