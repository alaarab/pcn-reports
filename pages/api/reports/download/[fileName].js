// pages/api/reports/download/[fileName].js
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    const { fileName } = req.query;
    const csvStoragePath = process.env.CSV_STORAGE_PATH;
    const filePath = path.join(csvStoragePath, fileName);

    if (fs.existsSync(filePath)) {
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.status(500).json({ error: "Error reading the file" });
            } else {
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
                res.status(200).send(data);
            }
        });
    } else {
        res.status(404).json({ error: "File not found" });
    }
}