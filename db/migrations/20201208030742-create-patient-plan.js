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
      patientId: {
        type: Sequelize.STRING,
        references: {
          model: {
            tableName: "Patients",
          },
          key: "id",
        },
      },
      insurancePlanId: {
        type: Sequelize.STRING,
        references: {
          model: {
            tableName: "InsurancePlans",
          },
          key: "id",
        },
      },
      groupId: {
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
