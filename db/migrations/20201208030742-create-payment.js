"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Payments", {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },
      guarantorId: {
        type: Sequelize.STRING,
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
      postDate: {
        type: Sequelize.DATE,
      },
      referenceDate: {
        type: Sequelize.DATE,
      },
      amount: {
        type: Sequelize.DECIMAL,
      },
      voucherId: {
        type: Sequelize.STRING,
      },
      visitId: {
        type: Sequelize.STRING,
        references: {
          model: {
            tableName: "Visits",
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
    await queryInterface.dropTable("Payments");
  },
};
