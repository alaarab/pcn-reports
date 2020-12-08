"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("InsurancePlans", {
      id: {
        allowNull: false,
        primaryKey: true,
        unique: true,
        type: Sequelize.STRING,
      },
      name: {
        type: Sequelize.STRING,
      },
      address: {
        type: Sequelize.STRING,
      },
      zip: {
        type: Sequelize.STRING,
      },
      city: {
        type: Sequelize.STRING,
      },
      state: {
        type: Sequelize.STRING,
      },
      businessPhone: {
        type: Sequelize.STRING,
      },
      writedownAdjustmentCode: {
        type: Sequelize.STRING,
      },
      paymentProfileCode: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("InsurancePlans");
  },
};
