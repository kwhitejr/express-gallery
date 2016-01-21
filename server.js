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
  var data = {
    photos: [
      {author: 'Kevin', link: 'http://lorempixel.com/400/200/nature', description: 'This is a nature.'},
      {author: 'Ben', link: 'http://lorempixel.com/400/200/transport', description: 'This is a transport.'},
      {author: 'John', link: 'http://lorempixel.com/400/200/cats', description: 'This is a cats.'},
      {author: 'Fred', link: 'http://lorempixel.com/400/200/animals', description: 'This is a animals.'}
    ]
  };
  res.render('index', data);
});



db.sequelize
  .sync()
  .then(function () {
    app.listen(PORT, function () {
      console.log('listening on ' + PORT);
    });
  });