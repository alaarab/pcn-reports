const { Pool } = require("pg");
const fs = require("fs");
const csvParser = require("csv-parser");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: ".env" });

const csvFolderPath = path.join(__dirname, 'csv');
const logDir = path.join(__dirname, 'logs');

const practiceId = '0001'

// Read CSV file
async function readCSV(filename) {
  return new Promise((resolve, reject) => {
    const data = [];
    fs.createReadStream(path.join(csvFolderPath, filename))
      .pipe(csvParser())
      .on('data', row => data.push(row))
      .on('end', () => resolve(data))
      .on('error', reject);
  });
}

// Log errors to file
function logError(error, file) {
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }
  fs.appendFile(path.join(logDir, file), `${new Date().toISOString()} - ${error}\n`, err => {
    if (err) console.error('Error writing to log file:', err);
  });
}

// Clear the logs folder
function clearLogs() {
  if (fs.existsSync(logDir)) {
    fs.readdirSync(logDir).forEach(file => {
      fs.unlinkSync(path.join(logDir, file));
    });
  }
}

// Date parser function
function dateParser(dateStr) {
  if (!dateStr) return null;
  const [year, month, day] = [dateStr.substr(0, 4), dateStr.substr(4, 2), dateStr.substr(6, 2)];
  return new Date(`${year}-${month}-${day}`);
}

// Helper functions to format SQL query
function queryFields(resultObj) {
  return Object.keys(resultObj).map(key => `"${key}"`).join(",");
}

function queryDollar(resultObj) {
  return Object.keys(resultObj).map((_, index) => `$${index + 1}`).join(",");
}

// Main function to import patient data
async function importPatientData() {
  
  console.time('importPatientData');

  clearLogs();

  const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
  });

  try {
    // add a timer 

    const [patients, persons, charges] = await Promise.all([
      readCSV('Patient.csv'),
      readCSV('Person.csv'),
      readCSV('Charge.csv')
    ]);

    console.log('Creating patients...');

    // Process each patient
    for (const patient of patients.filter(p => p.practice_id === practiceId)) {
      // Process data for each patient
      await processPatientData(patient, persons, charges, pool);
    }
  } catch (error) {
    console.error('An error occurred:', error);
    logError(error, 'general.txt');
  } finally {
    await pool.end();
  }

  console.timeEnd('importPatientData');
}

// Function to process data for each patient
async function processPatientData(patient, persons, charges, pool) {
  try {
    const patientInfo = persons.find(p => p.person_id === patient.person_id && p.practice_id === practiceId);
    if (!patientInfo) {
      console.log(`Person not found: ${patient.person_id}`);
      logError(`Person not found: ${patient.person_id}`, 'patient.txt');
      return;
    }

    const patientCharges = charges.filter(c => c.person_id === patient.person_id && c.practice_id === practiceId && parseFloat(c.pat_amt) > 0);
    if (patientCharges.length === 0) {
      return;
    }

    const guarantorInfo = persons.find(p => p.person_id === patient.guar_id && p.practice_id === practiceId);
    let guarantorId = guarantorInfo ? guarantorInfo["person_id"] : await createNullGuarantor(patientInfo, pool);

    // Create or update guarantor
    await createOrUpdateGuarantor(guarantorInfo, guarantorId, pool);

    // Create the patient
    await createPatient(patientInfo, guarantorId, pool);

    // Create Visits and Charges
    await createVisitsAndCharges(patient, patientCharges, guarantorId, pool);

  } catch (error) {
    console.error(`Error in processPatientData for ${patient.person_id}:`, error);
    logError(`Error ${error} on ${patient.person_id}`, 'patient.txt');
  }
}

async function createNullGuarantor(patientInfo, pool) {
  const nullGuarantorCounter = await getNullGuarantorCount(pool) + 1;
  const guarantorId = `NULL-GUARANTOR-${nullGuarantorCounter}`;
  let guarantorObj = {
    id: guarantorId,
    ...createGuarantorObject(patientInfo, nullGuarantorCounter)
  };
  await createOrUpdateGuarantor(guarantorObj, guarantorId, pool);
  return guarantorId;
}

async function getNullGuarantorCount(pool) {
  const result = await pool.query(`SELECT COUNT(*) FROM "Guarantors" WHERE "id" LIKE 'NULL-GUARANTOR-%'`);
  return parseInt(result.rows[0].count, 10);
}

function createGuarantorObject(info, suffix) {
  return {
    firstName: info["first_name"],
    middleName: info["middle_name"],
    lastName: info["last_name"],
    dob: dateParser(info["date_of_birth"]),
    address: info["address_line_1"],
    zip: info["zip"],
    city: info["city"],
    state: info["state"],
    phone: info["home_phone"],
    workPhone: info["day_phone"],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

async function createOrUpdateGuarantor(guarantorInfo, guarantorId, pool) {
  if (guarantorInfo) {
    let guarantorObj = { id: guarantorId, ...createGuarantorObject(guarantorInfo) };

    const fields = queryFields(guarantorObj);
    const values = queryDollar(guarantorObj);
    const updateFields = updateQueryFields(guarantorObj);

    const query = `
      INSERT INTO "Guarantors"(${fields})
      VALUES(${values})
      ON CONFLICT (id)
      DO UPDATE SET ${updateFields}
    `;

    await pool.query(query, Object.values(guarantorObj));
  }
}

function updateQueryFields(obj) {
  return Object.keys(obj).map((key, index) => `"${key}" = $${index + 1}`).join(", ");
}

async function createPatient(patientInfo, guarantorId, pool) {
  let patientObj = {
    id: patientInfo["person_id"],
    ...createGuarantorObject(patientInfo), // Assuming patientObj structure is similar to guarantorObj
    guarantorId: guarantorId,
    practiceId: "2"
  };
  await pool.query(
    `INSERT INTO "Patients"(${queryFields(patientObj)}) VALUES(${queryDollar(patientObj)})`,
    Object.values(patientObj)
  );
}

async function createVisitsAndCharges(patient, patientCharges, guarantorId, pool) {
  for (const charge of patientCharges) {
    const chargeId = `${patient.person_id}-${charge.charge_id}`; // Assuming charge_id is available in charge
    await createVisit(chargeId, patient.person_id, guarantorId, pool);
    await createCharge(charge, chargeId, pool);
  }
}

async function createVisit(visitId, patientId, guarantorId, pool) {
  let visitObj = {
    id: visitId,
    patientId: patientId,
    guarantorId: guarantorId,
    locationId: "na", // Placeholder, replace with actual data if available
    providerId: null, // Placeholder, replace with actual data if available
    claimId: null, // Placeholder, replace with actual data if available
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  await pool.query(
    `INSERT INTO "Visits"(${queryFields(visitObj)}) VALUES(${queryDollar(visitObj)})`,
    Object.values(visitObj)
  );
}

async function createCharge(charge, visitId, pool) {
  let chargeObj = {
    visitId: visitId,
    providerId: null, // Placeholder, replace with actual data if available
    procedureId: "misc", // Placeholder, replace with actual data if available
    amount: parseFloat(charge["pat_amt"]),
    fromServiceDate: dateParser(charge["begin_date_of_service"]),
    toServiceDate: dateParser(charge["end_date_of_service"]),
    postDate: dateParser(charge["end_date_of_service"]),
    approvedAmount: parseFloat(charge["amt"]),
    legacyId: null, // Placeholder, replace with actual data if available
    supervisingProvider: null, // Placeholder, replace with actual data if available
    lineNumber: null, // Placeholder, replace with actual data if available
    placeOfService: null, // Placeholder, replace with actual data if available
    diagId: null, // Placeholder, replace with actual data if available
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  await pool.query(
    `INSERT INTO "Charges"(${queryFields(chargeObj)}) VALUES(${queryDollar(chargeObj)})`,
    Object.values(chargeObj)
  );
}

importPatientData();