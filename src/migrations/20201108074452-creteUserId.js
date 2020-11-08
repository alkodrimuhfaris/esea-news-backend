'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Articles', 'userId', {
      allowNull: false,
      type: Sequelize.INTEGER
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Articles', 'userId', {
      allowNull: true,
      type: Sequelize.INTEGER
    })
  }
};
