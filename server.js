var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var isAuthenticated = require('./middleware/isAuthenticated');


var db = require('./models');
var Photo = db.Photo;
var CONFIG = require('./config.json');
var User = db.User;


var app = express();

app.set('view engine', 'jade');
app.set('views', 'views');

// tells express where all the public files are located
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(session(CONFIG.SESSION));

// Authentication Strategy
passport.use(new LocalStrategy(
  function (username, password, done) {
    User.find({
      where: {
        username: username,
        password: password
      }
    }).
    // result of the find is a user
    then(function (user) {
      if ( !user ) {
        return done(null, false);
      }
      // the thing inside the done will be assigned to req.user
      // first parameter is error
      return done(null, user);
    });
  }
));

/****** I don't know what this does **********/
passport.serializeUser(function (user, done) {
  return done(null, user);
});

passport.deserializeUser(function (user, done) {
  return done(null, user);
});

app.use(passport.initialize());
app.use(passport.session());
/*******************************************/

// Outsourced routing functions
app.use('/gallery', require('./routers/galleryRouter'));

// Index
app.get('/', function (req, res) {
  Photo.findAll()
    .then(function (results) {
      res.render('index', {
        photos: results,
        isAuthenticated: req.isAuthenticated()
      });
    });
});

// Login
app.route('/login')
  .get(function (req, res) {
    res.render('login');
  })
  .post(
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login'
    })
);

// Logout is a route rather than a button
app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

db.sequelize
  .sync()
  .then(function () {
    app.listen(CONFIG.PORT, function () {
      console.log('listening on ' + CONFIG.PORT);
    });
  });