var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var isAuthenticated = require('./middleware/isAuthenticated');
var RedisStore = require('connect-redis')(session);
var morgan = require('morgan');

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
app.use(session({
  store: new RedisStore(
    {
      host: '127.0.0.1',
      port: '6379'
    }
  ),
  secret: CONFIG.SESSION.secret
  })
);
app.use(morgan('dev'));

// Authentication Strategy
passport.use(new LocalStrategy(
  {
    passReqToCallback: true
  },
  function (req, username, password, done) {
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

//creates a default value for res.locals
app.use(function (req, res, next) {
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});

// Outsourced routing functions
app.use('/gallery', require('./routers/galleryRouter'));

// Index
app.get('/', function (req, res) {
  Photo.findAll()
    .then(function (results) {
      res.render('index', {
        photos: results,
        // isAuthenticated: req.isAuthenticated()
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

// Catch-all route-undefined handler
app.use(function (req, res, next) {
  res.status(404);
  return res.send('What are you doing here?');
});

// Default catch-all middleware
app.use(function (err, req, res, next) {
  if (err) {
    res.status(500);
  }
  return res.send('What are you doing here?');
});

db.sequelize
  .sync()
  .then(function () {
    app.listen(CONFIG.PORT, function () {
      console.log('listening on ' + CONFIG.PORT);
    });
  });