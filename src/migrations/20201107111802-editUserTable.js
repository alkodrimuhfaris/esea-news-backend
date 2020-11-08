'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      await queryInterface.changeColumn('Users', 'email', {
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
      await queryInterface.changeColumn('Users', 'username', {
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
    return Promise.all([
      await queryInterface.changeColumn('Users', 'email', {
        username: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true
        }
      }),
      await queryInterface.changeColumn('Users', 'username', {
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
  }
}
