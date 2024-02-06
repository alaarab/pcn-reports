'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Insert practices
    const [pcn, nextGen] = await queryInterface.bulkInsert('Practices', [
      { name: 'PCN', createdAt: new Date(), updatedAt: new Date() },
      { name: 'NextGen', createdAt: new Date(), updatedAt: new Date() }
    ], { returning: true });

    // Update patients and guarantors to use the PCN practice
    await queryInterface.bulkUpdate('Patients', { practiceId: pcn.id }, {});
    await queryInterface.bulkUpdate('Guarantors', { practiceId: pcn.id }, {});
  },

  async down(queryInterface, Sequelize) {
    // In the down method, you can optionally remove the inserted practices
    // and revert changes made to the patients and guarantors
    await queryInterface.bulkDelete('Practices', { name: ['PCN', 'NextGen'] }, {});
  }
};
