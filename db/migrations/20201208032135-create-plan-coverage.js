'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('PlanCoverages', {
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
      legacyId: {
        type: Sequelize.STRING,
        references: {
          model: {
            tableName: "Visits",
          },
          key: "legacyId",
        },
      },
      groupId: {
        type: Sequelize.STRING
      },
      performingProvider: {
        type: Sequelize.STRING
      },
      procedure: {
        type: Sequelize.STRING
      },
      amount: {
        type: Sequelize.DECIMAL
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
    await queryInterface.dropTable('PlanCoverages');
  }
};