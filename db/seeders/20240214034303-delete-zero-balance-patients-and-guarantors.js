const models = require('../models'); // Replace with the actual path to your Sequelize models

// Helper function to calculate patient balance
const calculatePatientBalance = (patient) => {
  const visitTotal = patient.visit
    .reduce((total, { charge, assignment }) => {
      const chargeTotal = charge.reduce((sum, { amount }) => sum + parseFloat(amount), 0);
      const paymentTotal = assignment.reduce((sum, { amount }) => sum + parseFloat(amount), 0);
      return total + chargeTotal - paymentTotal;
    }, 0);

  const correctionTotal = patient.correction
    .reduce((total, { amount }) => total + parseFloat(amount), 0);

  const balance = visitTotal - correctionTotal;

  // round the balance to 2 decimal places
  return parseFloat(balance.toFixed(2));
};

function csvEscape(field) {
    if (field === null || field === undefined) {
        return '';
    }
    // Convert the field to a string (in case it's not already a string)
    let stringField = String(field);
    // Escape double quotes by doubling them
    stringField = stringField.replace(/"/g, '""');
    // If the field contains a comma, newline, or double quote, enclose it in double quotes
    if (stringField.includes(',') || stringField.includes('\n') || stringField.includes('"')) {
        stringField = `"${stringField}"`;
    }
    return stringField;
}

// Helper function to process a single batch
const processBatch = async (batchIds) => {
  const patients = await models.Patient.findAll({
    where: { id: batchIds },
    include: [{
      model: models.Visit,
      as: 'visit',
      include: [
        { model: models.Charge, as: 'charge' },
        { model: models.Assignment, as: 'assignment' },
      ]
    }, {
      model: models.Correction,
      as: 'correction'
    }]
  });

  for (const patient of patients) {
    const balance = calculatePatientBalance(patient);

    // if balance is 0, delete the patient, its coming in as toFixed(2) so we can compare it to 0
    if (balance === 0) {
      await models.sequelize.transaction(async (t) => {
        const visitIds = patient.visit.map(v => v.id);
        await models.Assignment.destroy({ where: { visitId: { [models.Sequelize.Op.in]: visitIds } }, transaction: t });
        await models.Charge.destroy({ where: { visitId: { [models.Sequelize.Op.in]: visitIds } }, transaction: t });
        await models.Payment.destroy({ where: { visitId: { [models.Sequelize.Op.in]: visitIds } }, transaction: t });
        await models.Visit.destroy({ where: { id: { [models.Sequelize.Op.in]: visitIds } }, transaction: t });
        await models.PatientPlan.destroy({ where: { patientId: patient.id }, transaction: t });
        await models.Correction.destroy({ where: { patientId: patient.id }, transaction: t });
        await models.Patient.destroy({ where: { id: patient.id }, transaction: t });

        console.log(`Deleted patient ${patient.id}`);
      });
    } else {
      console.log(`Skipping patient ${patient.id} with balance ${balance}`);
    }
  }
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const batchSize = 50; // Adjust the batch size as per your system's capability
    const concurrency = 30; // Number of concurrent batches

    // Fetch all patient IDs
    const patientIds = (await models.Patient.findAll({
      attributes: ['id'],
      raw: true
    })).map(p => p.id);

    let currentIndex = 0;

    const worker = async () => {
      while (currentIndex < patientIds.length) {
        const batchStart = currentIndex;
        const batchIds = patientIds.slice(batchStart, batchStart + batchSize);
        currentIndex += batchSize;

        console.log(`Worker processing batch starting from index ${batchStart}`);
        await processBatch(batchIds);
        console.log(`Worker completed batch starting from index ${batchStart}`);
      }
    };

    const workers = Array.from({ length: concurrency }, () => worker());
    await Promise.all(workers);
    console.log('All batches processed');
  },
  down: async (queryInterface, Sequelize) => {
    // Logic to revert the migration, if necessary
  }
};
