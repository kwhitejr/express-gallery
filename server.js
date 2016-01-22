var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var db = require('./models');
var PORT = 3000;
var Photo = db.Photo;

var app = express();

app.use(bodyParser.urlencoded({extended: false}));

app.set('view engine', 'jade');
app.set('views', 'views');

app.get('/', function (req, res) {
  Photo.findAll()
    .then(function (results) {
      res.render('index', {photos: results});
    });
});

app.get('/gallery/:id', function (req, res) {
  console.log(req.params);
  Photo.find({where: {id: req.params.id}})
    .then(function (result) {
      var locals = {
        author:      result.author,
        link:        result.link,
        description: result.description
      };
      res.render('gallery', locals);
    });
});

db.sequelize
  .sync()
  .then(function () {
    app.listen(PORT, function () {
      console.log('listening on ' + PORT);
    });
  });