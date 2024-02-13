import { createRouter } from "next-connect";
import middleware from "middlewares/middleware";
import { calculatePatientBalance } from "../patient/search"; // Import patient balance calculation
import { calculateGuarantorBalance } from "../guarantor/search"; // Import guarantor balance calculation
import { formatAmount } from "assets/util";
const models = require("../../../db/models/index");

const handler = createRouter()
  .use(middleware)
  .get(async (req, res) => {
    // Include Patient and Guarantor in the query
    const include = [
      {
        model: models.Patient,
        as: 'patient',
        include: [{
          model: models.Guarantor,
          as: 'guarantor',
          include: [
            {
              model: models.Patient,
              as: "patient",
              include: [
                {
                  model: models.Visit,
                  as: "visit",
                  include: [
                    { model: models.Charge, as: "charge" },
                    { model: models.Assignment, as: "assignment" },
                  ],
                },
                {
                  model: models.Correction,
                  as: "correction",
                },
              ],
            },
          ]
        },
        {
          model: models.Visit,
          as: "visit",
          include: [
            { model: models.Charge, as: "charge" },
            { model: models.Assignment, as: "assignment" },
          ],
        },
        {
          model: models.Correction,
          as: "correction",
        }]
      }

    ];


    // Fetch Corrections with associated Patient and Guarantor, ordered by date
    const corrections = await models.Correction.findAll({
      include: include,
      order: [['date', 'ASC']] // Corrected order syntax
    });

    // Convert to CSV
    const csvContent = convertToCSV(corrections);

    // Set headers for CSV download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="transactions.csv"');
    return res.status(200).send(csvContent);
  });

export default handler.handler({
  onError: (err, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});

// Updated helper function to convert JSON to CSV
function convertToCSV(data) {
  const headers = ['Patient Name', 'Guarantor Name', 'Amount', 'Date', 'Patient Balance', 'Guarantor Balance'];
  const rows = data.map(correction => {
    // Extracting necessary data
    const patient = correction.patient;
    const guarantor = patient.guarantor;
    const patientName = `${patient.firstName} ${patient.lastName}`;
    const guarantorName = guarantor ? `${guarantor.firstName} ${guarantor.lastName}` : 'N/A';
    const amount = formatAmount(correction.amount);
    const date = correction.date.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
    const patientBalance = calculatePatientBalance(patient);
    const guarantorBalance = calculateGuarantorBalance(patient.guarantor);

    return [patientName, guarantorName, amount, date, patientBalance, guarantorBalance];
  });

  return [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
}