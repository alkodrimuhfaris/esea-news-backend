'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
    }
  };
  Users.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    birthdate: DataTypes.DATEONLY,
    phone: DataTypes.STRING,
    resetcode: DataTypes.STRING,
    emailcode: DataTypes.STRING,
    emailverif: DataTypes.BOOLEAN,
    roleId: DataTypes.INTEGER,
    username: DataTypes.STRING,
    avatar: DataTypes.STRING,
    adminId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Users'
  })
  return Users
}
