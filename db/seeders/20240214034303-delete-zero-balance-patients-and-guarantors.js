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

const processPatientBatch = async (batchIds) => {
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

const processGuarantorBatch = async (batchIds) => {
  const guarantors = await models.Guarantor.findAll({
    where: { id: batchIds },
    include: [{
      model: models.Patient,
      as: 'patient',
      attributes: ['id'],
      required: false
    }]
  });

  for (const guarantor of guarantors) {
    if (guarantor.patient.length === 0) {
      await models.sequelize.transaction(async (t) => {
        await models.Guarantor.destroy({ where: { id: guarantor.id }, transaction: t });
        console.log(`Deleted unlinked guarantor ${guarantor.id}`);
      });
    } else {
      console.log(`Skipping guarantor ${guarantor.id} with linked patients`);
    }
  }
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const patientBatchSize = 50; // Adjust as per your system's capability
    const guarantorBatchSize = 100; // Adjust as per your system's capability
    const concurrency = 30; // Number of concurrent batches

    // Fetch all patient IDs
    const patientIds = (await models.Patient.findAll({
      attributes: ['id'],
      raw: true
    })).map(p => p.id);

    let patientIndex = 0;

    const patientWorker = async () => {
      while (patientIndex < patientIds.length) {
        const batchStart = patientIndex;
        const batchIds = patientIds.slice(batchStart, batchStart + patientBatchSize);
        patientIndex += patientBatchSize;
        console.log(`Worker processing patient batch starting from index ${batchStart}`);
        await processPatientBatch(batchIds);
        console.log(`Worker completed patient batch starting from index ${batchStart}`);
      }
    };

    const patientWorkers = Array.from({ length: concurrency }, () => patientWorker());
    await Promise.all(patientWorkers);

    // Process guarantors
    const guarantorIds = (await models.Guarantor.findAll({
      attributes: ['id'],
      raw: true
    })).map(g => g.id);

    let guarantorIndex = 0;
    const guarantorWorker = async () => {
      while (guarantorIndex < guarantorIds.length) {
        const batchStart = guarantorIndex;
        const batchIds = guarantorIds.slice(batchStart, batchStart + guarantorBatchSize);
        guarantorIndex += guarantorBatchSize;
        console.log(`Worker processing guarantor batch starting from index ${batchStart}`);
        await processGuarantorBatch(batchIds);
        console.log(`Worker completed guarantor batch starting from index ${batchStart}`);
      }
    }

    const guarantorWorkers = Array.from({ length: concurrency }, () => guarantorWorker());

    await Promise.all(guarantorWorkers);

    console.log('All patient and guarantor batches processed');
  },
  down: async (queryInterface, Sequelize) => {
    // Logic to revert the migration, if necessary
  }
};
