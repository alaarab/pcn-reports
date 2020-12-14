"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Patients", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      ssn: {
        type: Sequelize.STRING,
      },
      guarantorId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: {
            tableName: "Guarantors",
          },
          key: "id",
        },
      },
      firstName: {
        type: Sequelize.STRING,
      },
      middleName: {
        type: Sequelize.STRING,
      },
      lastName: {
        type: Sequelize.STRING,
      },
      sex: {
        type: Sequelize.STRING,
      },
      dob: {
        type: Sequelize.DATE,
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
      phone: {
        type: Sequelize.STRING,
      },
      workPhone: {
        type: Sequelize.STRING,
      },
      lastDateOfService: {
        type: Sequelize.DATE,
      },
      insurance: {
        type: Sequelize.DATE,
      },
      balance: {
        type: Sequelize.DATE,
      },
      unappliedInsuranceBalance: {
        type: Sequelize.DECIMAL,
      },
      registrationDate: {
        type: Sequelize.DATE,
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
    await queryInterface.dropTable("Patients");
  },
};
