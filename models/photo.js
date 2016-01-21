module.exports = function (sequelize, DataTypes) {
  var Photo = sequelize.define('Photo', {
    author: DataTypes.STRING,
    link: DataTypes.STRING,
    description: DataTypes.STRING
  });

  return Photo;
};