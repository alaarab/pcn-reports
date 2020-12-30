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
        allowNull: false,
        references: {
          model: {
            tableName: "Visits",
          },
          key: "id",
        },
      },
      providerId: {
        type: Sequelize.STRING,
        allowNull: true,
        references: {
          model: {
            tableName: "Providers",
          },
          key: "id",
        },
      },
      diagId: {
        type: Sequelize.STRING,
      },
      locationId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: {
            tableName: "Locations",
          },
          key: "id",
        },
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
