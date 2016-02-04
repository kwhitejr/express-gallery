var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;  // Want to use Basic Authentication Strategy


var db = require('./models');
var PORT = 3000;
var Photo = db.Photo;

var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(methodOverride('_method'));

app.set('view engine', 'jade');
app.set('views', 'views');

// tells express where all the public files are located
app.use(express.static('public'));

passport.use(new BasicStrategy(
  function(username, password, done) {
    if ( !(username === user.username && password === user.password) ) {
      return done(null, false);
    }
    return done(null, user);
  }
));

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

app.get('/gallery/new', function (req, res) {
  res.render('new-form', {});
});

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

app.get('/gallery/:id/edit', function (req, res) {
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
    app.listen(PORT, function () {
      console.log('listening on ' + PORT);
    });
  });