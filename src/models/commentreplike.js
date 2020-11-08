'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CommentRepLike extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  CommentRepLike.init({
    commentRepId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    reaction: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'CommentRepLike',
  });
  return CommentRepLike;
};