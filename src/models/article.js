/* eslint-disable eol-last */
/* eslint-disable comma-dangle */
/* eslint-disable space-before-function-paren */
/* eslint-disable semi */
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Article.hasMany(models.ArticleGallery, { foreignKey: 'articleId', onDelete: 'CASCADE', hooks: true, onUpdate: 'CASCADE' })
    }
  };
  Article.init({
    title: DataTypes.STRING,
    caption: DataTypes.TEXT,
    article: DataTypes.TEXT,
    views: DataTypes.INTEGER,
    picture: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Article',
  });
  return Article;
};