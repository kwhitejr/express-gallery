var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

var db = require('./models');
var PORT = 3000;
var Photo = db.Photo;

var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(methodOverride('_method'));

app.set('view engine', 'jade');
app.set('views', 'views');

app.put('/gallery/:id', function (req, res) {
  res.render('put-form');
});

app.delete('/gallery/:id', function (req, res) {
  res.render('delete-form');
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