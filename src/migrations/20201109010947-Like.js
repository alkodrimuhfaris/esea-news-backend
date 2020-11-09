'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      await queryInterface.renameColumn('Likes', 'reaction', 'like'),
      await queryInterface.renameColumn('CommentLikes', 'reaction', 'like'),
      await queryInterface.renameColumn('CommentRepLikes', 'reaction', 'like'),
      await queryInterface.changeColumn('Likes', 'like', {
        type: Sequelize.BOOLEAN,
        allowNull: true
      }),
      await queryInterface.changeColumn('CommentLikes', 'like', {
        type: Sequelize.BOOLEAN,
        allowNull: true
      }),
      await queryInterface.changeColumn('CommentRepLikes', 'like', {
        type: Sequelize.BOOLEAN,
        allowNull: true
      }),
      await queryInterface.addColumn('Likes', 'love', {
        type: Sequelize.BOOLEAN,
        allowNull: true
      }),
      await queryInterface.addColumn('CommentLikes', 'love', {
        type: Sequelize.BOOLEAN,
        allowNull: true
      }),
      await queryInterface.addColumn('CommentRepLikes', 'love', {
        type: Sequelize.BOOLEAN,
        allowNull: true
      }),
      await queryInterface.addColumn('Likes', 'fine', {
        type: Sequelize.BOOLEAN,
        allowNull: true
      }),
      await queryInterface.addColumn('CommentLikes', 'fine', {
        type: Sequelize.BOOLEAN,
        allowNull: true
      }),
      await queryInterface.addColumn('CommentRepLikes', 'fine', {
        type: Sequelize.BOOLEAN,
        allowNull: true
      }),
      await queryInterface.addColumn('Likes', 'angry', {
        type: Sequelize.BOOLEAN,
        allowNull: true
      }),
      await queryInterface.addColumn('CommentLikes', 'angry', {
        type: Sequelize.BOOLEAN,
        allowNull: true
      }),
      await queryInterface.addColumn('CommentRepLikes', 'angry', {
        type: Sequelize.BOOLEAN,
        allowNull: true
      }),
      await queryInterface.addColumn('Likes', 'dislike', {
        type: Sequelize.BOOLEAN,
        allowNull: true
      }),
      await queryInterface.addColumn('CommentLikes', 'dislike', {
        type: Sequelize.BOOLEAN,
        allowNull: true
      }),
      await queryInterface.addColumn('CommentRepLikes', 'dislike', {
        type: Sequelize.BOOLEAN,
        allowNull: true
      })
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      await queryInterface.removeColumn('Likes', 'love'),
      await queryInterface.removeColumn('CommentLikes', 'love'),
      await queryInterface.removeColumn('CommentRepLikes', 'love'),
      await queryInterface.removeColumn('Likes', 'fine'),
      await queryInterface.removeColumn('CommentLikes', 'fine'),
      await queryInterface.removeColumn('CommentRepLikes', 'fine'),
      await queryInterface.removeColumn('Likes', 'angry'),
      await queryInterface.removeColumn('CommentLikes', 'angry'),
      await queryInterface.removeColumn('CommentRepLikes', 'angry'),
      await queryInterface.removeColumn('Likes', 'dislike'),
      await queryInterface.removeColumn('CommentLikes', 'dislike'),
      await queryInterface.removeColumn('CommentRepLikes', 'dislike'),
    ])
  }
};