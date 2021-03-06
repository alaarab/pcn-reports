"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Assignments", {
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
      chargeLine: {
        type: Sequelize.INTEGER,
      },
      activityCount: {
        type: Sequelize.INTEGER,
      },
      assignmentType: {
        type: Sequelize.STRING,
      },
      paymentId: {
        type: Sequelize.STRING,
        allowNull: true,
        references: {
          model: {
            tableName: "Payments",
          },
          key: "id",
        },
      },
      amount: {
        type: Sequelize.DECIMAL,
      },
      postDate: {
        type: Sequelize.DATE,
      },
      glAccountCodeId: {
        type: Sequelize.STRING,
        allowNull: true,
        references: {
          model: {
            tableName: "glAccountCodes",
          },
          key: "id",
        },
      },
      unappliedCreditNumber: {
        type: Sequelize.STRING,
      },
      transferToInsuranceCreditedPlan: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable("Assignments");
  },
};
