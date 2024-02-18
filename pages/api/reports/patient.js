import { createRouter } from "next-connect";
import middleware from "middlewares/middleware";
import { calculatePatientBalance } from "../patient/search";
const models = require("../../../db/models/index");
const fs = require('fs');
const path = require('path');

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

const csvStoragePath = process.env.CSV_STORAGE_PATH;

// Cleanup function to be called on server start
export function cleanupResidualFiles() {
    const generatingFilePath = path.join(csvStoragePath, 'PatientsReport.generating');
    if (fs.existsSync(generatingFilePath)) {
        fs.unlinkSync(generatingFilePath);
    }
}

const handler = createRouter()
    .use(middleware)
    .get(async (req, res) => {
        const date = new Date();
        const csvFileName = `Patients-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}.csv`;
        const csvFilePath = path.join(csvStoragePath, csvFileName);
        const tempCsvFilePath = `${csvFilePath}.tmp`; // Temporary file path
        const generatingFilePath = `${csvFilePath}.generating`;

        if (fs.existsSync(generatingFilePath)) {
            return res.status(409).json({ message: "Patient report generation is already in progress." });
        }

        fs.writeFileSync(generatingFilePath, '');

        const existingFiles = fs.readdirSync(csvStoragePath).filter(file => file.startsWith("Patients-") && file.endsWith(".csv"));
        existingFiles.forEach(file => {
            const filePathToDelete = path.join(csvStoragePath, file);
            try {
                fs.unlinkSync(filePathToDelete);
            } catch (deleteError) {
                console.error(`Error deleting file: ${filePathToDelete}`, deleteError);
            }
        });

        try {
            const batchSize = 100;
            let offset = 0;
            let hasMore = true;
            const headers = ['ID', 'FirstName', 'LastName', 'Balance', 'Practice'].join(',') + '\n';
            fs.writeFileSync(tempCsvFilePath, headers);

            while (hasMore) {
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
                    if (patient.balance != 0) {
                        const csvRow = [
                            csvEscape(patient.id),
                            csvEscape(patient.firstName),
                            csvEscape(patient.lastName),
                            csvEscape(patient.balance),
                            csvEscape(patient.practice?.name)
                        ].join(',') + '\n';
                        fs.appendFileSync(tempCsvFilePath, csvRow);
                    }
                }

                if (patients.length < batchSize) {
                    hasMore = false;
                } else {
                    offset += batchSize;
                }
            }

            fs.renameSync(tempCsvFilePath, csvFilePath);
            fs.unlinkSync(generatingFilePath);
            res.status(201).json({ message: "Patient report generated successfully." });

        } catch (error) {
            if (fs.existsSync(generatingFilePath)) {
                fs.unlinkSync(generatingFilePath);
            }
            if (fs.existsSync(tempCsvFilePath)) {
                fs.unlinkSync(tempCsvFilePath);
            }
            console.error(error.stack);
            res.status(500).json({ error: "Error generating patient report." });
        }
    });

export default handler.handler({
    onError: (err, req, res) => {
        console.error(err.stack);
        res.status(err.statusCode || 500).end(err.message);
    },
});