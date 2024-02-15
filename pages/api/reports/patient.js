import { createRouter } from "next-connect";
import middleware from "middlewares/middleware";
import { calculatePatientBalance } from "../patient/search";
const models = require("../../../db/models/index");
import { Transform } from 'stream';

export function csvEscape(field) {
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

const handler = createRouter()
    .use(middleware)
    .get(async (req, res) => {

        res.setHeader('Content-Type', 'text/csv');
        const date = new Date();
        res.setHeader('Content-Disposition', `attachment; filename="Patients-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}.csv"`);

        const batchSize = 1000; // Adjust as needed
        let offset = 0;
        let hasMore = true;

        // Create a stream transformer to format data as CSV
        const csvTransform = new Transform({
            writableObjectMode: true,
            transform(patient, encoding, callback) {
                const csvRow = [
                    csvEscape(patient.id),
                    csvEscape(patient.firstName),
                    csvEscape(patient.lastName),
                    csvEscape(patient.balance),
                    csvEscape(patient.practice?.name)
                ].join(',') + '\n';
                callback(null, csvRow);
            }
        });

        // Pipe the transform stream to the response
        csvTransform.pipe(res);

        // Write CSV headers
        csvTransform.write(['ID', 'FirstName', 'LastName', 'Balance', 'Practice'].join(',') + '\n');

        while (hasMore) {

            console.log('Fetching patients', offset)
            const patients = await models.Patient.findAll({
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
                limit: batchSize,
                offset: offset,
            });

            for (let patient of patients) {
                patient.balance = calculatePatientBalance(patient);
                if (patient.balance > 0) {
                    csvTransform.write(patient);
                }
            }

            if (patients.length < batchSize) {
                hasMore = false;
            } else {
                offset += batchSize;
            }
        }

        // End the stream
        csvTransform.end();
    });

export default handler.handler({
    onError: (err, req, res) => {
        console.error(err.stack);
        res.status(err.statusCode || 500).end(err.message);
    },
});