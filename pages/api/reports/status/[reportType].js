// pages/api/status/[reportType].js
import fs from 'fs';
import path from 'path';

const csvStoragePath = process.env.CSV_STORAGE_PATH;

export default async function handler(req, res) {
    const { reportType } = req.query; // 'patient' or 'guarantor'

    const reportPrefix = reportType === 'patient' ? "Patients-" : "Guarantors-";
    const latestReportFileName = findLatestReport(csvStoragePath, reportPrefix);
    const generatingFilePrefix = `${reportPrefix}${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}`;
    const generatingFilePath = path.join(csvStoragePath, `${generatingFilePrefix}.csv.generating`);
    const isGenerating = fs.existsSync(generatingFilePath);
    console.log(latestReportFileName)
    console.log(generatingFilePrefix)
    console.log(generatingFilePath)
    const status = isGenerating ? "Generating" : latestReportFileName ? "Ready" : "Not Generated";

    res.status(200).json({ 
        status: status,
        fileName: latestReportFileName
    });
}

function findLatestReport(directory, prefix) {
    const files = fs.readdirSync(directory);
    const reportFiles = files.filter(file => file.startsWith(prefix) && file.endsWith('.csv'));
    reportFiles.sort((a, b) => fs.statSync(path.join(directory, b)).mtime - fs.statSync(path.join(directory, a)).mtime);
    return reportFiles.length > 0 ? reportFiles[0] : null;
}
