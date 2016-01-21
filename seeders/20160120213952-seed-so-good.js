'use strict';

var faker = require('faker');

module.exports = {
  up: function (queryInterface, Sequelize) {
    var photos = [];
    for (var i = 0; i<10; i++) {
      photos.push({
        author: faker.name.firstName(),
        link: faker.image.image(),
        description: "this is a " + faker.lorem.words()
      });
    }
    return queryInterface.bulkInsert('Photos', photos, {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Photos', null, {});
  }
};
