var express = require('express');
var router = express.Router();

var db = require('../models');
var Photo = db.Photo;

router.route('/')
  .post(function (req, res) {
    Photo.create(req.body)
      .then(function (result) {
        res.redirect('/gallery/'+result.id);
      });
  });

router.route('/:id')
  .get(function (req, res) {
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
  })
  .put(function (req, res) {
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
  })
  .delete(function (req, res) {
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

module.exports = router;