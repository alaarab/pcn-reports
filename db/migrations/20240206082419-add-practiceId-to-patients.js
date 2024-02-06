'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Patients', 'practiceId', {
      type: Sequelize.INTEGER,
      // allowNull: false,
      references: {
        model: {
          tableName: "Practices",
        },
        key: 'id'
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Patients', 'practiceId');
  }
};
