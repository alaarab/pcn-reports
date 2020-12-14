"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Inpatients", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      visitId: {
        type: Sequelize.STRING,
      },
      providerId: {
        type: Sequelize.STRING,
      },
      diagId: {
        type: Sequelize.STRING,
      },
      locationId: {
        type: Sequelize.STRING,
      },
      legacyId: {
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
    await queryInterface.dropTable("Inpatients");
  },
};
