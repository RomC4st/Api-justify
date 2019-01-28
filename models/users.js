'use strict';
module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    passeword: DataTypes.STRING,
    ratelimit: DataTypes.INTEGER,
    faceBookId: DataTypes.STRING,
    token: DataTypes.STRING,
  }, {});
  users.associate = function(models) {
    // associations can be defined here
  };
  return users;
};