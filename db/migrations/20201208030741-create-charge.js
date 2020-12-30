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
      procedureId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: {
            tableName: "Procedures",
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
      supervisingProvider: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: {
            tableName: "Providers",
          },
          key: "id",
        },
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
      placeOfService: {
        type: Sequelize.STRING,
      },
      lineNumber: {
        type: Sequelize.INTEGER,
      },
      diagId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: {
            tableName: "DiagCodes",
          },
          key: "id",
        },
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
