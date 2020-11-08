'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Comment.hasMany(models.CommentRep, { foreignKey: 'commentId', onDelete: 'CASCADE', hooks: true, onUpdate: 'CASCADE' })
      Comment.hasMany(models.CommentLike, { foreignKey: 'commentId', onDelete: 'CASCADE', hooks: true, onUpdate: 'CASCADE' })
    }
  };
  Comment.init({
    articleId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    comment: DataTypes.TEXT,
    picture: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};