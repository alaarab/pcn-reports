import { createRouter } from "next-connect";
import middleware from "middlewares/middleware";
import { calculateGuarantorBalance } from "../guarantor/search";
const models = require("../../../db/models/index");

const handler = createRouter()
  .use(middleware)
  .get(async (req, res) => {
    const include = [
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
            model: models.Practice,
            as: "practice",
          },
          {
            model: models.Correction,
            as: "correction",
          },
        ],
      },
    ];

    const guarantors = await models.Guarantor.findAll({
      include: include,
      order: [['lastName', 'ASC'], ['firstName', 'ASC']],
    });

    const guarantorsWithTotal = guarantors.map(guarantor => ({
      ...guarantor.toJSON(),
      balance: calculateGuarantorBalance(guarantor),
    }));

    // Convert to CSV
    const csvContent = convertToCSV(guarantorsWithTotal);
    const date = new Date();

    // Set headers for CSV download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="Guarantors-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}.csv"`);
    return res.status(200).send(csvContent);
  });

export default handler.handler({
  onError: (err, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});

// Helper function to convert JSON to CSV
function convertToCSV(data) {
  const headers = ['ID', 'FirstName', 'LastName', 'Balance', 'Practice']; // Add other headers
  const rows = data.map(guarantor => [
    guarantor.id,
    guarantor.firstName,
    guarantor.lastName,
    guarantor.balance,
    guarantor.practice?.name
  ]);

  return [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
}
