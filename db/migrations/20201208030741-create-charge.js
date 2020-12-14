"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Charges", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
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
      procedure: {
        type: Sequelize.STRING,
      },
      providerId: {
        type: Sequelize.STRING,
      },
      supervisingProvider: {
        type: Sequelize.STRING,
      },
      amount: {
        type: Sequelize.DECIMAL,
      },
      approvedAmount: {
        type: Sequelize.DECIMAL,
      },
      fromServiceDate: {
        type: Sequelize.DATE,
      },
      toServiceDate: {
        type: Sequelize.DATE,
      },
      postDate: {
        type: Sequelize.DATE,
      },
      legacyId: {
        type: Sequelize.STRING,
      },
      generalNote: {
        type: Sequelize.STRING,
      },
      // diagnosis1-4?
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
    await queryInterface.dropTable("Charges");
  },
};
