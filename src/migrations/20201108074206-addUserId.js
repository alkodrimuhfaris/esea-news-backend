'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Articles', 'userId')
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Articles', 'userId')
  }
};
