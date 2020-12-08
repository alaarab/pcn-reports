"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("PatientPlans", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      patientNumber: {
        type: Sequelize.STRING,
        references: {
          model: {
            tableName: "Patients",
          },
          key: "patientNumber",
        },
      },
      insurancePlanNumber: {
        type: Sequelize.STRING,
        references: {
          model: {
            tableName: "InsurancePlans",
          },
          key: "number",
        },
      },
      groupNumber: {
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
    await queryInterface.dropTable("PatientPlans");
  },
};
