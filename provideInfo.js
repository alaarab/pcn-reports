const Excel = require('exceljs');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

const csvFolderPath = path.join(__dirname, 'csv');
const outputFilePath = path.join(__dirname, 'patient_report.xlsx'); // Output Excel file path

const patientID = 'B10ABF6E-94A7-46ED-B1E4-FABC2DE78587'
const practiceId = '0004'

if (!patientID) {
  console.error('Please provide a Patient ID.');
  process.exit(1);
}

const readCSV = (filename) => {
  return new Promise((resolve, reject) => {
    const data = [];
    fs.createReadStream(path.join(csvFolderPath, filename))
      .pipe(csv())
      .on('data', (row) => data.push(row))
      .on('end', () => {
        resolve(data);
      })
      .on('error', reject);
  });
};

const displayPatientData = async (patientID) => {
  const workbook = new Excel.Workbook();

  const patients = await readCSV('Patient.csv');
  const persons = await readCSV('Person.csv');
  // const accounts = await readCSV('Account.csv');
  const charges = await readCSV('Charge.csv');
  const transactions = await readCSV('Transaction.csv');
  const transactionDetails = await readCSV('TransactionDetail.csv');

  const patient = patients.find(p => p.person_id === patientID);
  if (!patient) {
    console.log(`No patient found with ID: ${patientID}`);
    return;
  }

  const patientInfo = persons.find(p => p.person_id === patientID);
  const guarantorInfo = persons.find(p => p.person_id === patient.guar_id);

  // Create Charges Sheet
  const chargesSheet = workbook.addWorksheet('Charges');
  chargesSheet.addRow(['Patient Name: ', `${patientInfo.first_name} ${patientInfo.last_name}`, '', 'Guarantor Name: ', `${guarantorInfo.first_name} ${guarantorInfo.last_name}`]);
  chargesSheet.addRow(['', '', '', '', '']);

  // Headers for the Charges Sheet
  chargesSheet.addRow(['Charge ID', 'Insurance Balance', 'Patient Balance', 'Amount', 'Date', 'Transaction ID', 'Type', 'Detail Amount', 'Transaction Detail Timestamp', 'Total Transaction Amount', 'Transaction Timestamp']);

  // Populate Charges Sheet with nested Transaction Details
  for (const charge of charges.filter(c => c.person_id === patientID && c.practice_id === practiceId)) {
    const insuranceAmount = parseFloat(charge.cob1_amt) + parseFloat(charge.cob2_amt) + parseFloat(charge.cob3_amt);

    chargesSheet.addRow([charge.charge_id, insuranceAmount, charge.pat_amt, charge.amt, charge.begin_date_of_service]);
    const transactionDetailsForCharge = transactionDetails.filter(td => td.charge_id === charge.charge_id);
    
    let transTotal = 0;

    for (const detail of transactionDetailsForCharge) {
      const detailType = detail.paid_amt !== 'NULL' ? 'Payment' : 'Adjustment';
      const detailAmount = detail.paid_amt !== 'NULL' ? detail.paid_amt : detail.adj_amt;
      const detailTimestamp = detail.create_timestamp;
      transTotal = transTotal + parseFloat(detailAmount);

      // Find related transaction (if any)
      const relatedTransaction = transactions.find(t => t.tran_id === detail.trans_id);
      const transactionAmount = relatedTransaction ? relatedTransaction.tran_amt : 'N/A';
      const transactionDate = relatedTransaction ? relatedTransaction.tran_date : 'N/A';

      chargesSheet.addRow(['', '', '', '', '', '', detail.trans_id, detailType, detailAmount, detailTimestamp, transactionAmount, transactionDate]);
      // Apply indentation for readability
      chargesSheet.lastRow.getCell(4).alignment = { indent: 5 };
    }

    chargesSheet.addRow(['', '', '', '', transTotal + parseFloat(charge.amt), '', '', '', transTotal]); // Blank row for separation

    chargesSheet.addRow([]); // Blank row for separation
  }

  // Write to file
  await workbook.xlsx.writeFile(outputFilePath);
  console.log(`Report generated: ${outputFilePath}`);
};

displayPatientData(patientID);