var express = require('express');
var path = require('path');
var bodyParser = require('bodyParser');

var db = require('./models');
var PORT = 3000;
var Photo = db.Photo;

var app = express();

app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function (req, res) {
  var data =
  res.render('index', data);
});

db.sequelize
  .sync()
  .then(function () {
    app.listen(PORT, function () {
      console.log('listening on ' + PORT);
    });
  });