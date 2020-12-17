const { Client } = require("pg");
var fs = require("fs");
var csv = require("csv");
var csvparser = csv.parse({
  columns: true,
  relax_column_count: true,
});
var txtparser = csv.parse({
  columns: true,
  relax_column_count: true,
  delimiter: "|",
});
const dotenv = require("dotenv");

dotenv.config({
  path: ".env",
});

// Add a line to the top a file
// sed -i -e '1iHere is my new top line\' filename
// Clean a file for Unix Import
// dos2unix --force file.txt

async function main() {
  const client = new Client({
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
  });
  await client.connect();

  console.log("Connected!");

  // await new Promise((resolve) => {
  //   var patientInput = fs.createReadStream("csv/patient.txt");

  //   var transform = csv.transform(async function (row, done) {
  //     let patientObj = {
  //       id: row["Patient Legacy Account Number"],
  //       guarantorId: row["Guarantor Legacy Account Number"],
  //       ssn: row["Pt SSN"],
  //       firstName: row["Pt  First Name"],
  //       middleName: row["Pt Middle Name"],
  //       lastName: row["Pt Last Name"],
  //       sex: row["Pt Sex"],
  //       dob: dateParser(row["Pt DOB"]),
  //       address: row["Pt Address"],
  //       zip: row["Pt Zip"],
  //       city: row["Pt City"],
  //       state: row["Pt State"],
  //       phone: row["Pt Phone"],
  //       workPhone: row["Pt Work Phone"],
  //       createdAt: new Date(),
  //       updatedAt: new Date(),
  //     };

  //     try {
  //       console.log(`Inserting Patient`);
  //       await client.query(
  //         `INSERT INTO "Patients"(${queryFields(
  //           patientObj
  //         )}) VALUES(${queryDollar(patientObj)})`,
  //         Object.values(patientObj)
  //       );
  //     } catch (err) {
  //       console.log(err.stack);
  //     }

  //     let guarantorObj = {
  //       id: row["Guarantor Legacy Account Number"],
  //       ssn: row["Guarantor SSN"],
  //       firstName: row["Guarantor First Name"],
  //       middleName: row["Guarantor Middle Name"],
  //       lastName: row["Guarantor Last/Company Name"],
  //       sex: row["Guarantor Sex"],
  //       dob: dateParser(row["Guarantor DOB"]),
  //       address: row["Guarantor Address"],
  //       zip: row["Guarantor Zip"],
  //       city: row["Guarantor City"],
  //       state: row["Guarantor State"],
  //       phone: row["Guarantor Phone"],
  //       workPhone: row["Guarantor Work Phone"],
  //       createdAt: new Date(),
  //       updatedAt: new Date(),
  //     };

  //     try {
  //       console.log(`Inserting Guarantor`);
  //       await client.query(
  //         `INSERT INTO "Guarantors"(${queryFields(
  //           guarantorObj
  //         )}) VALUES(${queryDollar(guarantorObj)})`,
  //         Object.values(guarantorObj)
  //       );
  //     } catch (err) {
  //       console.log(err.stack);
  //     }

  //     done(null, null);
  //   });

  //   patientInput
  //     .pipe(txtparser)
  //     .pipe(transform)
  //     .on("end", () => resolve());
  // });

  // Locations
  // await new Promise((resolve) => {
  //   var locationInput = fs.createReadStream("csv/locations.csv");

  //   var transform = csv.transform(async function (row, done) {
  //     // since id was being difficult
  //     let id = row[Object.keys(row)[0]];

  //     var resultObj = {
  //       id: id,
  //       description: row['description'],
  //       address: row['address'],
  //       zip: row['zip'],
  //       city: row['city'],
  //       state: row['state'],
  //       phoneNumber: row['phoneNumber'],
  //       npi: row['npi'],
  //       createdAt: new Date(),
  //       updatedAt: new Date(),
  //     };

  //     try {
  //       console.log(`Inserting Locations`);
  //       await client.query(
  //         `INSERT INTO "Locations"(${queryFields(
  //           resultObj
  //         )}) VALUES(${queryDollar(resultObj)})`,
  //         Object.values(resultObj)
  //       );
  //     } catch (err) {
  //       console.log(err.stack);
  //     }
  //     done(null, null);
  //   });

  //   locationInput
  //     .pipe(csvparser)
  //     .pipe(transform)
  //     .on("end", () => resolve());
  // });

  // await new Promise((resolve) => {
  //   var glAccountCodeInput = fs.createReadStream("csv/glacctcode.csv");

  //   var transform = csv.transform(async function (row, done) {
  //     // since id was being difficult
  //     let id = row[Object.keys(row)[0]];

  //     var resultObj = {
  //       id: id,
  //       class: row["class"],
  //       description: row["description"],
  //       createdAt: new Date(),
  //       updatedAt: new Date(),
  //     };

  //     try {
  //       console.log(`Inserting glAccountCode`);
  //       await client.query(
  //         `INSERT INTO "glAccountCodes"(${queryFields(
  //           resultObj
  //         )}) VALUES(${queryDollar(resultObj)})`,
  //         Object.values(resultObj)
  //       );
  //     } catch (err) {
  //       console.log(err.stack);
  //     }
  //     done(null, null);
  //   });

  //   glAccountCodeInput
  //     .pipe(csvparser)
  //     .pipe(transform)
  //     .on("end", () => resolve());
  // });

  // await new Promise((resolve) => {
  //   var providerInput = fs.createReadStream("csv/providers.csv");

  //   var transform = csv.transform(async function (row, done) {
  //     // since id was being difficult
  //     let id = row[Object.keys(row)[0]];

  //     var resultObj = {
  //       id: id,
  //       firstName: row["firstName"],
  //       lastName: row["lastName"],
  //       createdAt: new Date(),
  //       updatedAt: new Date(),
  //     };

  //     try {
  //       console.log(`Inserting Provider`);
  //       await client.query(
  //         `INSERT INTO "Providers"(${queryFields(
  //           resultObj
  //         )}) VALUES(${queryDollar(resultObj)})`,
  //         Object.values(resultObj)
  //       );
  //     } catch (err) {
  //       console.log(err.stack);
  //     }
  //     done(null, null);
  //   });

  //   providerInput
  //     .pipe(csvparser)
  //     .pipe(transform)
  //     .on("end", () => resolve());
  // });

  // await new Promise((resolve) => {
  //   var visitInput = fs.createReadStream("csv/visit.txt");

  //   var transform = csv.transform(async function (row, done) {
  //     // since id was being difficult

  //     var resultObj = {
  //       id: row["Visit #"],
  //       patientId: row["Patient #"],
  //       guarantorId: row["Guarantor #"],
  //       locationId: row["Service Center"],
  //       providerId: row["Billing Provider"],
  //       claimId: row["Claim #"],
  //       createdAt: new Date(),
  //       updatedAt: new Date(),
  //     };

  //     try {
  //       console.log(`Inserting Visit`);
  //       await client.query(
  //         `INSERT INTO "Visits"(${queryFields(
  //           resultObj
  //         )}) VALUES(${queryDollar(resultObj)})`,
  //         Object.values(resultObj)
  //       );
  //     } catch (err) {
  //       console.log(err.stack);
  //       console.log('failed on ', resultObj)
  //     }
  //     done(null, null);
  //   });

  //   visitInput
  //     .pipe(txtparser)
  //     .pipe(transform)
  //     .on("end", () => resolve());
  // });

  await new Promise((resolve) => {
    var paymentInput = fs.createReadStream("csv/payment.txt");

    var transform = csv.transform(async function (row, done) {
      // since id was being difficult
      let id = row[Object.keys(row)[0]];

      var resultObj = {
        id: row["Payment #"],
        guarantorId: row["Guarantor #"],
        insurancePlanId: row["Plan / Carrier"],
        postDate: row["Post Date"],
        referenceDate: row["Reference Date"],
        amount: row["Amount"],
        voucherId: row["Voucher #"],
        visitId: row["Legacy ID"],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      try {
        console.log(`Inserting Payment`);
        await client.query(
          `INSERT INTO "Payments"(${queryFields(
            resultObj
          )}) VALUES(${queryDollar(resultObj)})`,
          Object.values(resultObj)
        );
      } catch (err) {
        console.log(err.stack);
      }
      done(null, null);
    });

    paymentInput
      .pipe(parser)
      .pipe(transform)
      .on("end", () => resolve());
  });

  // await new Promise((resolve) => {
  //   var chargeInput = fs.createReadStream("csv/charge.txt");

  //   var transform = csv.transform(async function (row, done) {
  //     // since id was being difficult
  //     let id = row[Object.keys(row)[0]];

  //     var resultObj = {
  //       visitId: row["Visit #"],
  //       providerId: row["Performing Provider"],
  //       procedure: row["Procedure"],
  //       amount: row["Amount"],
  //       fromServiceDate: row["From Service Date"],
  //       toServiceDate: row["To Service Date"],
  //       postDate: row["Post Date"],
  //       approvedAmount: row["Approved Amount"],
  //       legacyId: row["Legacy ID"],
  //       supervisingProvider: row["Supervising Provider"],
  //       createdAt: new Date(),
  //       updatedAt: new Date(),
  //     };

  //     try {
  //       console.log(`Inserting Charge`);
  //       await client.query(
  //         `INSERT INTO "Charges"(${queryFields(
  //           resultObj
  //         )}) VALUES(${queryDollar(resultObj)})`,
  //         Object.values(resultObj)
  //       );
  //     } catch (err) {
  //       console.log(err.stack);
  //     }
  //     done(null, null);
  //   });

  //   chargeInput
  //     .pipe(parser)
  //     .pipe(transform)
  //     .on("end", () => resolve());
  // });

  await client.end();
}

main();

function queryFields(resultObj) {
  return Object.keys(resultObj)
    .map((key, index) => {
      return `"${key}"`;
    })
    .join(",");
}

function queryDollar(resultObj) {
  let ret = [];
  for (i = 0; i < Object.keys(resultObj).length; i++) {
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
