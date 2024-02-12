import { createRouter } from "next-connect";
import middleware from "middlewares/middleware";
import { calculatePatientBalance } from "../patient/search";
const models = require("../../../db/models/index");

const handler = createRouter()
    .use(middleware)
    .get(async (req, res) => {
        const include = [
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
        ];

        const patients = await models.Patient.findAll({
            include: include,
            order: [['lastName', 'ASC'], ['firstName', 'ASC']],
        });

        const patientsWithTotal = patients.map(patient => ({
            ...patient.toJSON(),
            balance: calculatePatientBalance(patient),
        }));

        // Convert to CSV
        const csvContent = convertToCSV(patientsWithTotal);

        // Set headers for CSV download
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="patients.csv"');
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
    const headers = ['ID', 'FirstName', 'LastName', 'Balance']; // Add other headers
    const rows = data.map(patient => [
        patient.id,
        patient.firstName,
        patient.lastName,
        patient.balance,
    ]);

    return [
        headers.join(','),
        ...rows.map(row => row.join(','))
    ].join('\n');
}
