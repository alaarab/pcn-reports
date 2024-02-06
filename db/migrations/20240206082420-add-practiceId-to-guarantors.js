'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Guarantors', 'practiceId', {
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
    await queryInterface.removeColumn('Guarantors', 'practiceId');
  }
};
