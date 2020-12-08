'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Charges', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      visitId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: {
            tableName: "Visits",
          },
          key: "id",
        },
      },
      procedure: {
        type: Sequelize.STRING
      },
      provider: {
        type: Sequelize.STRING
      },
      amount: {
        type: Sequelize.DECIMAL
      },
      approvedAmount: {
        type: Sequelize.DECIMAL
      },
      legacyId: {
        type: Sequelize.STRING,
        references: {
          model: {
            tableName: "Visits",
          },
          key: "legacyId",
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Charges');
  }
};