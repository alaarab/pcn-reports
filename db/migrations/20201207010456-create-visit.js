"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Visits", {
      id: {
        allowNull: false,
        primaryKey: true,
        unique: true,
        type: Sequelize.STRING,
      },
      legacyId: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      visitDate: {
        type: Sequelize.DATE,
      },
      patientId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: {
            tableName: "Patients",
          },
          key: "id",
        },
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
    await queryInterface.dropTable("Visits");
  },
};
