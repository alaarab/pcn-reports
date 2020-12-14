'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Assignments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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
        type: Sequelize.INTEGER
      },
      activityCount: {
        type: Sequelize.INTEGER
      },
      assingmentType: {
        type: Sequelize.STRING
      },
      paymentId: {
        type: Sequelize.STRING
      },
      amount: {
        type: Sequelize.DECIMAL
      },
      postDate: {
        type: Sequelize.DATE
      },
      glAccountTag: {
        type: Sequelize.STRING
      },
      unappliedCreditNumber: {
        type: Sequelize.STRING
      },
      transferToInsuranceCreditedPlan: {
        type: Sequelize.STRING
      },
      legacyId: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Assignments');
  }
};