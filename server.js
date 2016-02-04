var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;  // Want to use Basic Authentication Strategy
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');



var db = require('./models');
var Photo = db.Photo;
var CONFIG = require('./config.json');
var user = CONFIG.USER;

var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(session(CONFIG.SESSION));

app.set('view engine', 'jade');
app.set('views', 'views');

// tells express where all the public files are located
app.use(express.static('public'));

passport.use(new LocalStrategy(
  function (username, password, done) {
    var isAuthenticated = authenticate(username, password);
    if ( !isAuthenticated ) {
      return done(null, false);
    }
    // the thing inside the done will be assigned to req.user
    return done(null, user);
  }
));

// Global Functions
function isAuthenticated (req, res, next) {
  console.log(req.user);
  if (! req.isAuthenticated()) {
    return res.redirect('/login');
  }
  return next();
}

app.put('/gallery/:id', function (req, res) {
  console.log(req.body);
  Photo.update(
    {
      author:      req.body.author,
      link:        req.body.link,
      description: req.body.description,
      updatedAt:   new Date()
    },
    {
      where: {id: req.params.id},
      returning: true
    }
  )
  .then(function (result) {
    res.redirect('/gallery/'+req.params.id);
  });
});

app.delete('/gallery/:id', function (req, res) {
  Photo.destroy(
    {
      where:
        {id: parseInt(req.params.id)}
    }
  )
  .then(function () {
      res.redirect('/');
    });
});


app.get('/', function (req, res) {
  Photo.findAll()
    .then(function (results) {
      res.render('index', {photos: results});
    });
});

// Logout is a route rather than a button
app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

app.get('/login', function (req, res) {
  res.render('login');
});

app.post('/login', function (req, res) {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  });
});

app.get('/gallery/new',
  isAuthenticated,
  function (req, res) {
    res.render('new-form', {});
  }
);

app.get('/gallery/:id', function (req, res) {
  Photo.find({where: {id: req.params.id}})
    .then(function (result) {
      var locals = {
        id:          result.id,
        author:      result.author,
        link:        result.link,
        description: result.description
      };
      res.render('gallery', locals);
    });
});

app.get('/gallery/:id/edit',
  isAuthenticated,
  function (req, res) {
    Photo.find({where: {id: req.params.id}})
      .then(function (result) {
        var locals = {
          id:          result.id,
          author:      result.author,
          link:        result.link,
          description: result.description
        };
        res.render('put-form', locals);
      });
});

app.post('/gallery', function (req, res) {
  Photo.create(req.body)
    .then(function (result) {
      res.redirect('/gallery/'+result.id);
    });
});

db.sequelize
  .sync()
  .then(function () {
    app.listen(CONFIG.PORT, function () {
      console.log('listening on ' + CONFIG.PORT);
    });
  });