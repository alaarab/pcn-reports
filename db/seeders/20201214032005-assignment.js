'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert("Assignments", [
      {
        id: "1",
        visitId: "1",
        chargeLine: 1,
        activityCount: 1,
        assingmentType: "1",
        paymentId: "1",
        amount: 11.11,
        postDate: new Date(),
        glAccountCodeId: "1",
        unappliedCreditNumber: "1",
        transferToInsuranceCreditedPlan: "1",
        legacyId: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Assignments", null, {});
  }
};
