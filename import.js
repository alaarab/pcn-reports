const { Pool } = require("pg");
var fs = require("fs");
var csv = require("csv");
var parser = csv.parse({
  columns: true,
  relax_column_count: true,
  delimiter: "|",
});
const csvParser = require("csv-parser");
const dotenv = require("dotenv");

dotenv.config({
  path: ".env",
});

// Add a line to the top a file
// sed -i -e '1iHere is my new top line\' dataPath
// Remove blank lines
// sed '/^$/d' input.txt > output.txt

// Clean a file for Unix Import
// dos2unix --force file.txt

async function main() {
  const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
  });

  // Patients and Guarantors
  await new Promise((resolve) => {
    let dataPath = "csv/patient.txt";
    fs.createReadStream(dataPath)
      .pipe(csvParser({ separator: "|" }))
      .on("data", async (row, i) => {
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
          await pool.query(
            `INSERT INTO "Guarantors"(${queryFields(
              guarantorObj
            )}) VALUES(${queryDollar(guarantorObj)})`,
            Object.values(guarantorObj)
          );
        } catch (err) {
          fs.appendFile(
            "logs/log.txt",
            `${dataPath} ${err.message} on: ${JSON.stringify(
              resultObj,
              null,
              2
            )}\r\n`,
            function (err) {
              if (err) throw err;
              console.log("Error logged.");
            }
          );
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
          await pool.query(
            `INSERT INTO "Patients"(${queryFields(
              patientObj
            )}) VALUES(${queryDollar(patientObj)})`,
            Object.values(patientObj)
          );
        } catch (err) {
          fs.appendFile(
            "logs/log.txt",
            `${dataPath} ${err.message} on: ${JSON.stringify(
              resultObj,
              null,
              2
            )}\r\n`,
            function (err) {
              if (err) throw err;
              console.log("Error logged.");
            }
          );
        }
      })
      .on("end", async () => {
        resolve();
      });
  });

  // Locations
  await new Promise((resolve) => {
    let dataPath = "csv/location.txt";
    fs.createReadStream(dataPath)
      .pipe(csvParser({ separator: "|" }))
      .on("data", async (row, i) => {
        var resultObj = {
          id: row["Legacy Location Code"],
          description: row["Location Description"],
          address: row["Address 1"],
          zip: row["Zip Code"],
          city: row["City"],
          state: row["State"],
          phoneNumber: row["Phone Number"],
          npi: row["NPI"],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        try {
          await pool.query(
            `INSERT INTO "Locations"(${queryFields(
              resultObj
            )}) VALUES(${queryDollar(resultObj)})`,
            Object.values(resultObj)
          );
        } catch (err) {
          fs.appendFile(
            "logs/log.txt",
            `${dataPath} ${err.message} on: ${JSON.stringify(
              resultObj,
              null,
              2
            )}\r\n`,
            function (err) {
              if (err) throw err;
              console.log("Error logged.");
            }
          );
        }
      })
      .on("end", async () => {
        resolve();
      });
  });

  // Insurance Plans
  await new Promise(async (resolve) => {
    let dataPath = "csv/insplan.txt";
    fs.createReadStream(dataPath)
      .pipe(csvParser({ separator: "|" }))
      .on("data", async (row, i) => {
        var resultObj = {
          id: row["Insurance Plan Identifier"],
          name: row["Insurance Plan Name"],
          address: row["Insurance Plan Address"],
          zip: row["Insurance Plan Zip"],
          city: row["Insurance Plan City"],
          state: row["Insurance Plan State"],
          businessPhone: row["Ins Plan Business Phone"],
          copayAmount: parseInt(row["Copay Amount"], 10),
          writedownAdjustmentCode: row["Write-Down Adjustment Code"],
          paymentProfileCode: row["Payment Profile Code"],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        try {
          await pool.query(
            `INSERT INTO "InsurancePlans"(${queryFields(
              resultObj
            )}) VALUES(${queryDollar(resultObj)})`,
            Object.values(resultObj)
          );
        } catch (err) {
          fs.appendFile(
            "logs/log.txt",
            `${dataPath} ${err.message} on: ${JSON.stringify(
              resultObj,
              null,
              2
            )}\r\n`,
            function (err) {
              if (err) throw err;
              console.log("Error logged.");
            }
          );
        }
      })
      .on("end", async () => {
        resolve();
      });
  });

  // glAcctCodes
  await new Promise((resolve) => {
    let dataPath = "csv/glacctcd.txt";
    fs.createReadStream(dataPath)
      .pipe(csvParser({ separator: "|" }))
      .on("data", async (row, i) => {
        var resultObj = {
          id: row["GL Account Tag"],
          class: row["Class"],
          description: row["Description"],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        try {
          await pool.query(
            `INSERT INTO "glAccountCodes"(${queryFields(
              resultObj
            )}) VALUES(${queryDollar(resultObj)})`,
            Object.values(resultObj)
          );
        } catch (err) {
          fs.appendFile(
            "logs/log.txt",
            `${dataPath} ${err.message} on: ${JSON.stringify(
              resultObj,
              null,
              2
            )}\r\n`,
            function (err) {
              if (err) throw err;
              console.log("Error logged.");
            }
          );
        }
      })
      .on("end", async () => {
        resolve();
      });
  });

  // Procedures
  await new Promise((resolve) => {
    let dataPath = "csv/proccode.txt";
    fs.createReadStream(dataPath)
      .pipe(csvParser({ separator: "|" }))
      .on("data", async (row, i) => {
        var resultObj = {
          id: row["Legacy Procedure Code"],
          displayId: row["CPT Code"],
          description: row["CPT Description"],
          type: row["Procedure Class Description"],
          amount: row["Standard Fee"],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        try {
          await pool.query(
            `INSERT INTO "Procedures"(${queryFields(
              resultObj
            )}) VALUES(${queryDollar(resultObj)})`,
            Object.values(resultObj)
          );
        } catch (err) {
          fs.appendFile(
            "logs/log.txt",
            `${dataPath} ${err.message} on: ${JSON.stringify(
              resultObj,
              null,
              2
            )}\r\n`,
            function (err) {
              if (err) throw err;
              console.log("Error logged.");
            }
          );
        }
      })
      .on("end", async () => {
        resolve();
      });
  });

  // Providers
  await new Promise((resolve) => {
    let dataPath = "csv/provider.txt";
    fs.createReadStream(dataPath)
      .pipe(csvParser({ separator: "|" }))
      .on("data", async (row, i) => {
        var resultObj = {
          id: row["Legacy Provider Code"],
          firstName: row["First Name"],
          lastName: row["Last Name"],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        try {
          await pool.query(
            `INSERT INTO "Providers"(${queryFields(
              resultObj
            )}) VALUES(${queryDollar(resultObj)})`,
            Object.values(resultObj)
          );
        } catch (err) {
          fs.appendFile(
            "logs/log.txt",
            `${dataPath} ${err.message} on: ${JSON.stringify(
              resultObj,
              null,
              2
            )}\r\n`,
            function (err) {
              if (err) throw err;
              console.log("Error logged.");
            }
          );
        }
      })
      .on("end", async () => {
        resolve();
      });
  });

  // Patient Plans
  await new Promise((resolve) => {
    let dataPath = "csv/patplan.txt";
    fs.createReadStream(dataPath)
      .pipe(csvParser({ separator: "|" }))
      .on("data", async (row, i) => {
        var resultObj = {
          patientId: row["Patient Legacy Account Number"],
          insurancePlanId: row["Ins Plan#"],
          groupId: row["Group#"],
          memberId: row["Member ID for Claims"],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        try {
          await pool.query(
            `INSERT INTO "PatientPlans"(${queryFields(
              resultObj
            )}) VALUES(${queryDollar(resultObj)})`,
            Object.values(resultObj)
          );
        } catch (err) {
          fs.appendFile(
            "logs/log.txt",
            `${dataPath} ${err.message} on: ${JSON.stringify(
              resultObj,
              null,
              2
            )}\r\n`,
            function (err) {
              if (err) throw err;
              console.log("Error logged.");
            }
          );
        }
      })
      .on("end", async () => {
        resolve();
      });
  });

  // Visits
  await new Promise((resolve) => {
    let dataPath = "csv/visit.txt";
    fs.createReadStream(dataPath)
      .pipe(csvParser({ separator: "|" }))
      .on("data", async (row, i) => {
        var resultObj = {
          id: row["Visit #"],
          patientId: row["Patient #"],
          guarantorId: row["Guarantor #"],
          locationId: row["Service Center"],
          providerId: row["Billing Provider"],
          claimId: row["Claim #"],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        try {
          await pool.query(
            `INSERT INTO "Visits"(${queryFields(
              resultObj
            )}) VALUES(${queryDollar(resultObj)})`,
            Object.values(resultObj)
          );
        } catch (err) {
          fs.appendFile(
            "logs/log.txt",
            `${dataPath} ${err.message} on: ${JSON.stringify(
              resultObj,
              null,
              2
            )}\r\n`,
            function (err) {
              if (err) throw err;
              console.log("Error logged.");
            }
          );
        }
      })
      .on("end", async () => {
        resolve();
      });
  });

  // Payments
  await new Promise((resolve) => {
    let dataPath = "csv/payment.txt";
    fs.createReadStream(dataPath)
      .pipe(csvParser({ separator: "|" }))
      .on("data", async (row, i) => {
        var resultObj = {
          id: row["Payment #"],
          guarantorId: row["Guarantor #"],
          insurancePlanId: !!row["Plan / Carrier"]
            ? row["Plan / Carrier"]
            : null,
          postDate: row["Post Date"],
          referenceDate: row["Reference Date"],
          amount: row["Amount"],
          voucherId: row["Voucher #"],
          visitId: row["Legacy ID"],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        try {
          await pool.query(
            `INSERT INTO "Payments"(${queryFields(
              resultObj
            )}) VALUES(${queryDollar(resultObj)})`,
            Object.values(resultObj)
          );
        } catch (err) {
          fs.appendFile(
            "logs/log.txt",
            `${dataPath} ${err.message} on: ${JSON.stringify(
              resultObj,
              null,
              2
            )}\r\n`,
            function (err) {
              if (err) throw err;
              console.log("Error logged.");
            }
          );
        }
      })
      .on("end", async () => {
        resolve();
      });
  });

  // Charges
  await new Promise((resolve) => {
    let dataPath = "csv/charge.txt";
    fs.createReadStream(dataPath)
      .pipe(csvParser({ separator: "|" }))
      .on("data", async (row, i) => {
        var resultObj = {
          visitId: row["Visit #"],
          providerId: row["Performing Provider"],
          procedureId: row["Procedure"],
          amount: row["Amount"],
          fromServiceDate: dateParser(row["From Service Date"]),
          toServiceDate: dateParser(row["To Service Date"]),
          postDate: dateParser(row["Post Date"]),
          approvedAmount: row["Approved Amount"],
          legacyId: row["Legacy ID"],
          supervisingProvider: row["Supervising Provider"],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        try {
          await pool.query(
            `INSERT INTO "Charges"(${queryFields(
              resultObj
            )}) VALUES(${queryDollar(resultObj)})`,
            Object.values(resultObj)
          );
        } catch (err) {
          fs.appendFile(
            "logs/log.txt",
            `${dataPath} ${err.message} on: ${JSON.stringify(
              resultObj,
              null,
              2
            )}\r\n`,
            function (err) {
              if (err) throw err;
              console.log("Error logged.");
            }
          );
        }
      })
      .on("end", async () => {
        resolve();
      });
  });

  // Assignments
  await new Promise((resolve) => {
    let dataPath = "csv/assign.txt";
    fs.createReadStream(dataPath)
      .pipe(csvParser({ separator: "|" }))
      .on("data", async (row, i) => {
        var resultObj = {
          visitId: row["Visit #"],
          chargeLine: row["Charge Line #"],
          activityCount: row["Activity Count"],
          assingmentType: row["Assignment Type"],
          paymentId: row["Payment #"],
          amount: row["Amount"],
          postDate: dateParser(row["Post Date"]),
          glAccountCodeId: row["GL Account Tag"],
          unappliedCreditNumber: row["Unapplied Credit #"],
          transferToInsuranceCreditedPlan:
            row["Transfer To Insurance / Credited Plan"],
          legacyId: row["Legacy ID"],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        try {
          await pool.query(
            `INSERT INTO "Assignments"(${queryFields(
              resultObj
            )}) VALUES(${queryDollar(resultObj)})`,
            Object.values(resultObj)
          );
        } catch (err) {
          fs.appendFile(
            "logs/log.txt",
            `${dataPath} ${err.message} on: ${JSON.stringify(
              resultObj,
              null,
              2
            )}\r\n`,
            function (err) {
              if (err) throw err;
              console.log("Error logged.");
            }
          );
        }
      })
      .on("end", async () => {
        resolve();
      });
  });
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
