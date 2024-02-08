const { Pool } = require("pg");
var fs = require("fs");
const csvParser = require("csv-parser");
const dotenv = require("dotenv");
const path = require("path");
const { log } = require("console");

dotenv.config({
  path: ".env",
});

const csvFolderPath = path.join(__dirname, 'csv');

const readCSV = (filename) => {
  return new Promise((resolve, reject) => {
    const data = [];
    fs.createReadStream(path.join(csvFolderPath, filename))
      .pipe(csvParser())
      .on('data', (row) => data.push(row))
      .on('end', () => {  
        resolve(data);
      })
      .on('error', reject);
  });
};

const logError = (error, file) => {
  const logDir = path.join(__dirname, 'logs');
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }
  fs.appendFile(path.join(logDir, file), `${new Date().toISOString()} - ${error}\n`, (err) => {
    if (err) console.error('Error writing to log file:', err);
  });
};

const importPatientData = async () => {

  // clear the logs folder
  const logDir = path.join(__dirname, 'logs');
  if (fs.existsSync(logDir)) {
    fs.readdirSync(logDir).forEach((file, index) => {
      const curPath = path.join(logDir, file);
      fs.unlinkSync(curPath);
    });
  }

  const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
  });

  const patients = await readCSV('Patient.csv');
  const persons = await readCSV('Person.csv');
  // const charges = await readCSV('Charge.csv');
  // const transactions = await readCSV('Transaction.csv');
  // const transactionDetails = await readCSV('TransactionDetail.csv');

  console.log('Creating guarantors...')
  for (const person of persons.filter(p => p.practice_id === '0001')) {
    try {
      // console.log(`Processing person: ${person.first_name} ${person.last_name}`);
      const isGuarantor = patients.find(p => p.guar_id === person.person_id && p.practice_id === '0001');

      if (isGuarantor) {
        // console.log(`Creating guarantor: ${person.first_name} ${person.last_name}`)
        let guarantorObj = {
          id: person["person_id"],
          firstName: person["first_name"],
          middleName: person["middle_name"],
          lastName: person["last_name"],
          dob: dateParser(person["date_of_birth"]),
          address: person["address_line_1"],
          zip: person["zip"],
          city: person["city"],
          state: person["state"],
          phone: person["home_phone"],
          workPhone: person["day_phone"],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await pool.query(
          `INSERT INTO "Guarantors"(${queryFields(guarantorObj)}) VALUES(${queryDollar(guarantorObj)})`,
          Object.values(guarantorObj)
        );

        // console.log(`Guarantor created: ${person.first_name} ${person.last_name}`)
      }
    } catch (error) {
      console.error(`Errored out, see log: ${person.person_id} - ${person.first_name} ${person.last_name}`)
      logError(`Error ${error} on ${person.person_id} - ${person.first_name} ${person.last_name}`, 'guarantor.txt');
    }
  }

  let nullGuarantorCounter = 0;

  console.log('Creating patients...')
  for (const patient of patients.filter(p => p.practice_id === '0001')) {
    try {
      const patientInfo = persons.find(p => p.person_id === patient.person_id && p.practice_id === '0001');
      const guarantorInfo = persons.find(p => (p.person_id === patient.guar_id && p.practice_id === '0001') || (p.person_id === patient.guar_id));

      if(!guarantorInfo){
        nullGuarantorCounter++;
        // console.log(`Creating null guarantor: ${patientInfo.first_name} ${patientInfo.last_name}`)
        let guarantorObj = {
          id: `NULL-GUARANTOR-${nullGuarantorCounter}`,
          firstName: patientInfo["first_name"],
          middleName: patientInfo["middle_name"],
          lastName: patientInfo["last_name"],
          dob: dateParser(patientInfo["date_of_birth"]),
          address: patientInfo["address_line_1"],
          zip: patientInfo["zip"],
          city: patientInfo["city"],
          state: patientInfo["state"],
          phone: patientInfo["home_phone"],
          workPhone: patientInfo["day_phone"],
          practiceId: "2",
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await pool.query(
          `INSERT INTO "Guarantors"(${queryFields(guarantorObj)}) VALUES(${queryDollar(guarantorObj)})`,
          Object.values(guarantorObj)
        );
        // console.log(`Null guarantor created: ${patientInfo.first_name} ${patientInfo.last_name}`)
      }

      // console.log(`Creating patient: ${patientInfo.first_name} ${patientInfo.last_name}`)

      let patientObj = {
        id: patientInfo["person_id"],
        firstName: patientInfo["first_name"],
        middleName: patientInfo["middle_name"],
        lastName: patientInfo["last_name"],
        dob: dateParser(patientInfo["date_of_birth"]),
        address: patientInfo["address_line_1"],
        zip: patientInfo["zip"],
        city: patientInfo["city"],
        state: patientInfo["state"],
        phone: patientInfo["home_phone"],
        workPhone: patientInfo["day_phone"],
        guarantorId: guarantorInfo ? guarantorInfo["person_id"] : `NULL-GUARANTOR-${nullGuarantorCounter}`,
        practiceId: "2",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await pool.query(
        `INSERT INTO "Patients"(${queryFields(patientObj)}) VALUES(${queryDollar(patientObj)})`,
        Object.values(patientObj)
      );
      console.log(`Patient created: ${patientInfo.first_name} ${patientInfo.last_name}`)
    } catch (error) {
      console.error(`Errored out, see log: ${patient.person_id}`)
      logError(`Error ${error} on ${patient.person_id}`, 'patient.txt');
    }
  }
}

function queryFields(resultObj) {
  return Object.keys(resultObj)
    .map((key, index) => {
      return `"${key}"`;
    })
    .join(",");
}

function queryDollar(resultObj) {
  let ret = [];
  for (let i = 0; i < Object.keys(resultObj).length; i++) {
    ret.push(`$${i + 1}`);
  }
  return ret.join(",");
}

function dateParser(dateStr) {
  if (!dateStr) return null;

  let year = dateStr.substr(0, 4);
  let month = dateStr.substr(4, 2);
  let day = dateStr.substr(6, 2);

  let date = new Date(`${year}-${month}-${day}`);

  return date;
}

importPatientData();