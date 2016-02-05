'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {

    return queryInterface.bulkInsert('Users', [
      {
        username: 'thgaskell',
        password: 'thetiger',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});

  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
