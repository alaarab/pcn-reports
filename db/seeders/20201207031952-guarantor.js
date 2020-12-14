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
    await queryInterface.bulkInsert("Guarantors", [
      {
        id: "1",
        ssn: "11111111-11",
        firstName: "Ala",
        middleName: "K",
        lastName: "Arab",
        sex: "M",
        dob: new Date(),
        address: "123 a ave.",
        zip: "12212",
        city: "sacramento",
        state: "ca",
        phone: "9584123412",
        workPhone: "9584123412",
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
    await queryInterface.bulkDelete("Guarantors", null, {});
  }
};
