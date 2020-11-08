'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CommentRep extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      CommentRep.hasMany(models.CommentRepLike, { foreignKey: 'commentRepId', onDelete: 'CASCADE', hooks: true, onUpdate: 'CASCADE' })
    }
  };
  CommentRep.init({
    commentId: DataTypes.INTEGER,
    articleId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    comment: DataTypes.TEXT,
    picture: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'CommentRep',
  });
  return CommentRep;
};