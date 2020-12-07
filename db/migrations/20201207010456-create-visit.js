"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Visits", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      visitNumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      visitDate: {
        type: Sequelize.DATE,
      },
      patientNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: {
            tableName: "Patients",
          },
          key: "patientNumber",
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
