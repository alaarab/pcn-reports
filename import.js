const { Client } = require("pg");
var fs = require("fs");
var csv = require("csv");
var parser = csv.parse({
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
// Remove blank lines
// sed '/^$/d' input.txt > output.txt

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

  await new Promise((resolve) => {
    var patientInput = fs.createReadStream("csv/patient.txt");

    var transform = csv.transform(async function (row, done) {
      let guarantorObj = {
        id: row["Guarantor Legacy Account Number"],
        ssn: row["Guarantor SSN"],
        firstName: row["Guarantor First Name"],
        middleName: row["Guarantor Middle Name"],
        lastName: row["Guarantor Last/Company Name"],
        sex: row["Guarantor Sex"],
        dob: dateParser(row["Guarantor DOB"]),
        address: row["Guarantor Address"],
        zip: row["Guarantor Zip"],
        city: row["Guarantor City"],
        state: row["Guarantor State"],
        phone: row["Guarantor Phone"],
        workPhone: row["Guarantor Work Phone"],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      try {
        console.log(`Inserting Guarantor`);
        await client.query(
          `INSERT INTO "Guarantors"(${queryFields(
            guarantorObj
          )}) VALUES(${queryDollar(guarantorObj)})`,
          Object.values(guarantorObj)
        );
      } catch (err) {
        console.log(err.stack);
      }

      let patientObj = {
        id: row["Patient Legacy Account Number"],
        guarantorId: row["Guarantor Legacy Account Number"],
        ssn: row["Pt SSN"],
        firstName: row["Pt  First Name"],
        middleName: row["Pt Middle Name"],
        lastName: row["Pt Last Name"],
        sex: row["Pt Sex"],
        dob: dateParser(row["Pt DOB"]),
        address: row["Pt Address"],
        zip: row["Pt Zip"],
        city: row["Pt City"],
        state: row["Pt State"],
        phone: row["Pt Phone"],
        workPhone: row["Pt Work Phone"],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      try {
        console.log(`Inserting Patient`);
        await client.query(
          `INSERT INTO "Patients"(${queryFields(
            patientObj
          )}) VALUES(${queryDollar(patientObj)})`,
          Object.values(patientObj)
        );
      } catch (err) {
        console.log(err.stack);
      }

      done(null, null);
    });

    patientInput
      .pipe(parser)
      .pipe(transform)
      .on("end", () => resolve());
  });

  // await new Promise((resolve) => {
  //   var locationInput = fs.createReadStream("csv/location.txt");

  //   var transform = csv.transform(async function (row, done) {

  //     var resultObj = {
  //       id: row['Legacy Location Code'],
  //       description: row['Location Description'],
  //       address: row['Address 1'],
  //       zip: row['Zip Code'],
  //       city: row['City'],
  //       state: row['State'],
  //       phoneNumber: row['Phone Number'],
  //       npi: row['NPI'],
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
  //     .pipe(parser)
  //     .pipe(transform)
  //     .on("end", () => resolve());
  // });

  // await new Promise((resolve) => {
  //   var insurancePlanInput = fs.createReadStream("csv/insplan.txt");

  //   var transform = csv.transform(async function (row, done) {

  //     var resultObj = {
  //       id: row['Insurance Plan Identifier'],
  //       name: row['Insurance Plan Name'],
  //       address: row['Insurance Plan Address'],
  //       zip: row['Insurance Plan Zip'],
  //       city: row['Insurance Plan City'],
  //       state: row['Insurance Plan State'],
  //       businessPhone: row['Ins Plan Business Phone'],
  //       copayAmount: parseInt(row['Copay Amount'], 10),
  //       writedownAdjustmentCode: row['Write-Down Adjustment Code'],
  //       paymentProfileCode: row['Payment Profile Code'],
  //       createdAt: new Date(),
  //       updatedAt: new Date(),
  //     };

  //     try {
  //       console.log(`Inserting InsurancePlans`);
  //       await client.query(
  //         `INSERT INTO "InsurancePlans"(${queryFields(
  //           resultObj
  //         )}) VALUES(${queryDollar(resultObj)})`,
  //         Object.values(resultObj)
  //       );
  //     } catch (err) {
  //       console.log(err.stack);
  //     }
  //     done(null, null);
  //   });

  //   insurancePlanInput
  //     .pipe(parser)
  //     .pipe(transform)
  //     .on("end", () => resolve());
  // });

  await new Promise((resolve) => {
    var glAccountCodeInput = fs.createReadStream("csv/glacctcd.txt");

    var transform = csv.transform(async function (row, done) {

      var resultObj = {
        id: row['GL Account Tag'],
        class: row['Class'],
        description: row['Description'],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      try {
        console.log(`Inserting glAccountCodes`);
        await client.query(
          `INSERT INTO "glAccountCodes"(${queryFields(
            resultObj
          )}) VALUES(${queryDollar(resultObj)})`,
          Object.values(resultObj)
        );
      } catch (err) {
        console.log(err.stack);
      }
      done(null, null);
    });

    glAccountCodeInput
      .pipe(parser)
      .pipe(transform)
      .on("end", () => resolve());
  });

  await new Promise((resolve) => {
    var insurancePlanInput = fs.createReadStream("csv/proccode.txt");

    var transform = csv.transform(async function (row, done) {

      var resultObj = {
        id: row['Insurance Plan Identifier'],
        name: row['Insurance Plan Name'],
        address: row['Insurance Plan Address'],
        zip: row['Insurance Plan Zip'],
        city: row['Insurance Plan City'],
        state: row['Insurance Plan State'],
        businessPhone: row['Ins Plan Business Phone'],
        copayAmount: parseInt(row['Copay Amount'], 10),
        writedownAdjustmentCode: row['Write-Down Adjustment Code'],
        paymentProfileCode: row['Payment Profile Code'],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      try {
        console.log(`Inserting InsurancePlans`);
        await client.query(
          `INSERT INTO "InsurancePlans"(${queryFields(
            resultObj
          )}) VALUES(${queryDollar(resultObj)})`,
          Object.values(resultObj)
        );
      } catch (err) {
        console.log(err.stack);
      }
      done(null, null);
    });

    insurancePlanInput
      .pipe(parser)
      .pipe(transform)
      .on("end", () => resolve());
  });


  // await new Promise((resolve) => {
  //   var providerInput = fs.createReadStream("csv/provider.txt");

  //   var transform = csv.transform(async function (row, done) {

  //     var resultObj = {
  //       id: row["Legacy Provider Code"],
  //       firstName: row["First Name"],
  //       lastName: row["Last Name"],
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
  //     .pipe(parser)
  //     .pipe(transform)
  //     .on("end", () => resolve());
  // });

  // await new Promise((resolve) => {
  //   var patientPlanInput = fs.createReadStream("csv/patplan.txt");

  //   var transform = csv.transform(async function (row, done) {
  //     // since id was being difficult

  //     var resultObj = {
  //       patientId: row["Patient Legacy Account Number"],
  //       insurancePlanId: row["Ins Plan#"],
  //       groupId: row["Group#"],
  //       memberId: row["Member ID for Claims"],
  //       createdAt: new Date(),
  //       updatedAt: new Date(),
  //     };

  //     try {
  //       console.log(`Inserting PatientPlan`);
  //       await client.query(
  //         `INSERT INTO "PatientPlans"(${queryFields(resultObj)}) VALUES(${queryDollar(
  //           resultObj
  //         )})`,
  //         Object.values(resultObj)
  //       );
  //     } catch (err) {
  //       console.log(err.stack);
  //       console.log("failed on ", resultObj);
  //     }
  //     done(null, null);
  //   });

  //   patientPlanInput
  //     .pipe(parser)
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
  //         `INSERT INTO "Visits"(${queryFields(resultObj)}) VALUES(${queryDollar(
  //           resultObj
  //         )})`,
  //         Object.values(resultObj)
  //       );
  //     } catch (err) {
  //       console.log(err.stack);
  //       console.log("failed on ", resultObj);
  //     }
  //     done(null, null);
  //   });

  //   visitInput
  //     .pipe(parser)
  //     .pipe(transform)
  //     .on("end", () => resolve());
  // });

  // await new Promise((resolve) => {
  //   var paymentInput = fs.createReadStream("csv/payment.txt");

  //   var transform = csv.transform(async function (row, done) {
  //     // since id was being difficult

  //     var resultObj = {
  //       id: row["Payment #"],
  //       guarantorId: row["Guarantor #"],
  //       insurancePlanId: row["Plan / Carrier"],
  //       postDate: row["Post Date"],
  //       referenceDate: row["Reference Date"],
  //       amount: row["Amount"],
  //       voucherId: row["Voucher #"],
  //       visitId: row["Legacy ID"],
  //       createdAt: new Date(),
  //       updatedAt: new Date(),
  //     };

  //     try {
  //       console.log(`Inserting Payment`);
  //       await client.query(
  //         `INSERT INTO "Payments"(${queryFields(
  //           resultObj
  //         )}) VALUES(${queryDollar(resultObj)})`,
  //         Object.values(resultObj)
  //       );
  //     } catch (err) {
  //       console.log(err.stack);
  //     }
  //     done(null, null);
  //   });

  //   paymentInput
  //     .pipe(parser)
  //     .pipe(transform)
  //     .on("end", () => resolve());
  // });

  // await new Promise((resolve) => {
  //   var chargeInput = fs.createReadStream("csv/charge.txt");

  //   var transform = csv.transform(async function (row, done) {
  //     // since id was being difficult

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

  // await new Promise((resolve) => {
  //   var chargeInput = fs.createReadStream("csv/assign.txt");

  //   var transform = csv.transform(async function (row, done) {
  //     // since id was being difficult

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
