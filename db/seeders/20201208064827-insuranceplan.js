"use strict";

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
    await queryInterface.bulkInsert("InsurancePlans", [
      {
        number: "1",
        name: "Some Name",
        address: "2550 Earth St.",
        zip: "91919",
        city: "Los Angeles",
        state: "CA",
        businessPhone: "919-931-4125",
        writedownAdjustmentCode: "1",
        paymentProfileCode: "1",
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
    await queryInterface.bulkDelete("InsurancePlans", null, {});
  },
};
