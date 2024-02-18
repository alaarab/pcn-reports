import { createRouter } from "next-connect";
import middleware from "middlewares/middleware";
import { calculateGuarantorBalance } from "../guarantor/search";
const models = require("../../../db/models/index");
import { Transform } from 'stream';
import { csvEscape } from "./patient";
const fs = require('fs');
import path from "path";

const csvStoragePath = process.env.CSV_STORAGE_PATH;

// Cleanup function to be called on server start
export function cleanupResidualFiles() {
    const generatingFilePath = path.join(csvStoragePath, 'GuarantorsReport.generating');
    if (fs.existsSync(generatingFilePath)) {
        fs.unlinkSync(generatingFilePath);
    }
}

const handler = createRouter()
    .use(middleware)
    .get(async (req, res) => {
        const date = new Date();
        const csvFileName = `Guarantors-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}.csv`;
        const csvFilePath = path.join(csvStoragePath, csvFileName);
        const tempCsvFilePath = `${csvFilePath}.tmp`; // Temporary file path
        const generatingFilePath = `${csvFilePath}.generating`;

        if (fs.existsSync(generatingFilePath)) {
            return res.status(409).json({ message: "Guarantor report generation is already in progress." });
        }

        fs.writeFileSync(generatingFilePath, '');

        const existingFiles = fs.readdirSync(csvStoragePath).filter(file => file.startsWith("Guarantors-") && file.endsWith(".csv"));
        existingFiles.forEach(file => {
            const filePathToDelete = path.join(csvStoragePath, file);
            try {
                fs.unlinkSync(filePathToDelete);
            } catch (deleteError) {
                console.error(`Error deleting file: ${filePathToDelete}`, deleteError);
            }
        });

        try {

            const batchSize = 1000; // Adjust as needed
            let offset = 0;
            let hasMore = true;
            const headers = ['ID', 'FirstName', 'LastName', 'Balance', 'Practice'].join(',') + '\n';
            fs.writeFileSync(tempCsvFilePath, headers);

            while (hasMore) {
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
                    if (guarantor.balance != 0) {
                        const csvRow = [

                            csvEscape(guarantor.id),
                            csvEscape(guarantor.firstName),
                            csvEscape(guarantor.lastName),
                            csvEscape(guarantor.balance),
                            csvEscape(guarantor.patient?.practice?.name) // Assuming the practice is associated with the patient
                        ].join(',') + '\n';
                        fs.appendFileSync(tempCsvFilePath, csvRow);
                    }
                }

                if (guarantors.length < batchSize) {
                    hasMore = false;
                } else {
                    offset += batchSize;
                }
            }
            fs.renameSync(tempCsvFilePath, csvFilePath);
            fs.unlinkSync(generatingFilePath);
            res.status(201).json({ message: "Guarantor report generated successfully." });

        } catch (error) {
            if (fs.existsSync(generatingFilePath)) {
                fs.unlinkSync(generatingFilePath);
            }
            if (fs.existsSync(tempCsvFilePath)) {
                fs.unlinkSync(tempCsvFilePath);
            }
            console.error(error.stack);
            res.status(500).json({ error: "Error generating Guarantor report." });
        }
    });

export default handler.handler({
    onError: (err, req, res) => {
        console.error(err.stack);
        res.status(err.statusCode || 500).end(err.message);
    },
});
