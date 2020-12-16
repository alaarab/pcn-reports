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
      claimId: {
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
    await queryInterface.dropTable("Visits");
  },
};
