'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Payments', {
      paymentId: {
        type: Sequelize.STRING,
        primaryKey: true,
        unique: true,
        allowNull: false,
      },
      guarantorId: {
        type: Sequelize.STRING
      },
      planId: {
        type: Sequelize.STRING
      },
      postDate: {
        type: Sequelize.DATE
      },
      referenceDate: {
        type: Sequelize.DATE
      },
      amount: {
        type: Sequelize.DECIMAL
      },
      voucherId: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('Payments');
  }
};