import { createRouter } from "next-connect";
import middleware from "middlewares/middleware";
import { calculateGuarantorBalance } from "../guarantor/search";
const models = require("../../../db/models/index");
import { Transform } from 'stream';
import { csvEscape } from "./patient";

const handler = createRouter()
    .use(middleware)
    .get(async (req, res) => {

        res.setHeader('Content-Type', 'text/csv');
        const date = new Date();
        res.setHeader('Content-Disposition', `attachment; filename="Guarantors-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}.csv"`);

        const batchSize = 1000; // Adjust as needed
        let offset = 0;
        let hasMore = true;

        // Create a stream transformer to format data as CSV
        const csvTransform = new Transform({
            writableObjectMode: true,
            transform(guarantor, encoding, callback) {
                const csvRow = [
                    csvEscape(guarantor.id),
                    csvEscape(guarantor.firstName),
                    csvEscape(guarantor.lastName),
                    csvEscape(guarantor.balance),
                    csvEscape(guarantor.patient?.practice?.name) // Assuming the practice is associated with the patient
                ].join(',') + '\n';
                callback(null, csvRow);
            }
        });

        // Pipe the transform stream to the response
        csvTransform.pipe(res);

        // Write CSV headers
        csvTransform.write(['ID', 'FirstName', 'LastName', 'Balance', 'Practice'].join(',') + '\n');

        while (hasMore) {

            console.log('Fetching guarantors', offset)
            const guarantors = await models.Guarantor.findAll({
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
                                model: models.Practice,
                                as: "practice",
                            },
                            {
                                model: models.Correction,
                                as: "correction",
                            },
                        ],
                    },
                ],
                limit: batchSize,
                offset: offset,
            });

            for (let guarantor of guarantors) {
                guarantor.balance = calculateGuarantorBalance(guarantor);
                if (guarantor.balance > 0) {
                    csvTransform.write(guarantor);
                }
            }

            if (guarantors.length < batchSize) {
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
