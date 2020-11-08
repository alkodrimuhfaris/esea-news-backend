'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      await queryInterface.addColumn('Users', 'email', {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isEmail: true
        },
        unique: {
          args: true,
          msg: 'Email address already in use!'
        }
      }),
      await queryInterface.addColumn('Users', 'username', {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isUsername: true
        },
        unique: {
          args: true,
          msg: 'Username already in use!'
        }
      })
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', )
  }
};
