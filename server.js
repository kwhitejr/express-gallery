var express = require('express');
var path = require('path');

var db = require('./models');
var PORT = 3000;

var app = express();

app.get('/', function (req, res) {

});

db.sequelize
  .sync()
  .then(function () {
    app.listen(PORT, function () {
      console.log('listening on ' + PORT);
    });
  });