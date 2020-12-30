const { Pool } = require("pg");
var fs = require("fs");
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
  await new Promise(async (resolve) => {
    console.log("Beginning Patients and Guarantors.");
    let dataPath = "csv/patient.txt";
    let logFile = "logs/patient.txt";
    let stream = fs
      .createReadStream(dataPath)
      .pipe(csvParser({ separator: "|" }))
      .on("data", async (row, i) => {
        stream.pause();
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
          if (
            err.message !=
            `duplicate key value violates unique constraint "Guarantors_pkey"`
          ) {
            fs.appendFile(
              logFile,
              `${dataPath} ${err.message} on: ${JSON.stringify(
                guarantorObj,
                null,
                2
              )}\r\n`,
              function (err) {
                if (err) throw err;
                console.log("Error logged.");
              }
            );
          }
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
          class: row["Patient Class"],
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
            logFile,
            `${dataPath} ${err.message} on: ${JSON.stringify(
              patientObj,
              null,
              2
            )}\r\n`,
            function (err) {
              if (err) throw err;
              console.log("Error logged.");
            }
          );
        }
        stream.resume();
      })
      .on("end", async () => {
        resolve();
        console.log("Completed Patients and Guarantors.");
      });
  });

  // Diagnosis Codes
  await new Promise(async (resolve) => {
    console.log("Beginning Diagnosis Codes.");
    let dataPath = "csv/diagcode.txt";
    let logFile = "logs/diagcode.txt";
    let stream = fs
      .createReadStream(dataPath)
      .pipe(csvParser({ separator: "|" }))
      .on("data", async (row, i) => {
        stream.pause();
        var resultObj = {
          id: row["Legacy Diagnosis Code"],
          legacyId: row["ICD-9 Code"],
          description: row["ICD-9 Description"],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        try {
          await pool.query(
            `INSERT INTO "DiagCodes"(${queryFields(
              resultObj
            )}) VALUES(${queryDollar(resultObj)})`,
            Object.values(resultObj)
          );
        } catch (err) {
          fs.appendFile(
            logFile,
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
        stream.resume();
      })
      .on("end", async () => {
        resolve();
        console.log("Completed Diagnosis Codes.");
      });
  });

  // Locations
  await new Promise(async (resolve) => {
    console.log("Beginning Locations.");
    let dataPath = "csv/location.txt";
    let logFile = "logs/location.txt";
    let stream = fs
      .createReadStream(dataPath)
      .pipe(csvParser({ separator: "|" }))
      .on("data", async (row, i) => {
        stream.pause();
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
            logFile,
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
        stream.resume();
      })
      .on("end", async () => {
        resolve();
        console.log("Completed Locations.");
      });
  });

  // Insurance Plans
  await new Promise(async (resolve) => {
    console.log("Beginning Insurance Plans.");
    let dataPath = "csv/insplan.txt";
    let logFile = "logs/insplan.txt";
    let stream = fs
      .createReadStream(dataPath)
      .pipe(csvParser({ separator: "|" }))
      .on("data", async (row, i) => {
        stream.pause();
        var resultObj = {
          id: row["Insurance Plan Identifier"],
          name: row["Insurance Plan Name"],
          address: row["Insurance Plan Address"],
          zip: row["Insurance Plan Zip"],
          city: row["Insurance Plan City"],
          state: row["Insurance Plan State"],
          businessPhone: row["Ins Plan Business Phone"],
          copayAmount: parseFloat(row["Copay Amount"]) || 0,
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
            logFile,
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
        stream.resume();
      })
      .on("end", async () => {
        resolve();
        console.log("Completed Insurance Plan.");
      });
  });

  // glAcctCodes
  await new Promise(async (resolve) => {
    console.log("Beginning glAcctCodes.");
    let dataPath = "csv/glacctcd.txt";
    let logFile = "logs/glacctcd.txt";
    let stream = fs
      .createReadStream(dataPath)
      .pipe(csvParser({ separator: "|" }))
      .on("data", async (row, i) => {
        stream.pause();
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
            logFile,
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
        stream.resume();
      })
      .on("end", async () => {
        resolve();
        console.log("Completed glAcctCodes.");
      });
  });

  // Procedures
  await new Promise(async (resolve) => {
    console.log("Beginning Procedures.");
    let dataPath = "csv/proccode.txt";
    let logFile = "logs/proccode.txt";
    let stream = fs
      .createReadStream(dataPath)
      .pipe(csvParser({ separator: "|" }))
      .on("data", async (row, i) => {
        stream.pause();
        var resultObj = {
          id: row["Legacy Procedure Code"],
          displayId: row["CPT Code"],
          description: row["CPT Description"],
          type: row["Procedure Class Description"],
          amount: parseFloat(row["Standard Fee"]) || 0,
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
            logFile,
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
        stream.resume();
      })
      .on("end", async () => {
        resolve();
        console.log("Completed Procedures.");
      });
  });

  // Providers
  await new Promise(async (resolve) => {
    console.log("Beginning Providers.");
    let dataPath = "csv/provider.txt";
    let logFile = "logs/provider.txt";
    let stream = fs
      .createReadStream(dataPath)
      .pipe(csvParser({ separator: "|" }))
      .on("data", async (row, i) => {
        stream.pause();
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
            logFile,
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
        stream.resume();
      })
      .on("end", async () => {
        resolve();
        console.log("Completed Providers.");
      });
  });

  // Patient Plans
  await new Promise(async (resolve) => {
    console.log("Beginning Patient Plans.");
    let dataPath = "csv/patplan.txt";
    let logFile = "logs/patplan.txt";
    let stream = fs
      .createReadStream(dataPath)
      .pipe(csvParser({ separator: "|" }))
      .on("data", async (row, i) => {
        stream.pause();
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
            logFile,
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
        stream.resume();
      })
      .on("end", async () => {
        resolve();
        console.log("Completed Patient Plans.");
      });
  });

  // Visits
  await new Promise(async (resolve) => {
    console.log("Beginning Visits.");
    let dataPath = "csv/visit.txt";
    let logFile = "logs/visit.txt";
    let stream = fs
      .createReadStream(dataPath)
      .pipe(csvParser({ separator: "|" }))
      .on("data", async (row, i) => {
        stream.pause();
        var resultObj = {
          id: row["Visit #"],
          patientId: row["Patient #"],
          guarantorId: row["Guarantor #"],
          locationId: row["Service Center"],
          providerId: !!row["Billing Provider"]
            ? row["Billing Provider"]
            : null,
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
            logFile,
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
        stream.resume();
      })
      .on("end", async () => {
        resolve();
        console.log("Completed Visits.");
      });
  });

  // Inpatients
  // await new Promise(async (resolve) => {
  //   console.log("Beginning Inpatients.");
  //   let dataPath = "csv/inpatient.txt";
  //   let logFile = "logs/inpatient.txt";
  //   let stream = fs
  //     .createReadStream(dataPath)
  //     .pipe(csvParser({ separator: "|" }))
  //     .on("data", async (row, i) => {
  //       stream.pause();
  //       var resultObj = {
  //         visitId: row["Inpatient Visit #"],
  //         providerId: row["Provider Code"],
  //         diagId: row["Diagnosis"],
  //         locationId: row["Service Center"],
  //         legacyId: row["Legacy ID"],
  //         createdAt: new Date(),
  //         updatedAt: new Date(),
  //       };

  //       try {
  //         await pool.query(
  //           `INSERT INTO "Inpatients"(${queryFields(
  //             resultObj
  //           )}) VALUES(${queryDollar(resultObj)})`,
  //           Object.values(resultObj)
  //         );
  //       } catch (err) {
  //         fs.appendFile(
  //           logFile,
  //           `${dataPath} ${err.message} on: ${JSON.stringify(
  //             resultObj,
  //             null,
  //             2
  //           )}\r\n`,
  //           function (err) {
  //             if (err) throw err;
  //             console.log("Error logged.");
  //           }
  //         );
  //       }
  //       stream.resume();
  //     })
  //     .on("end", async () => {
  //       resolve();
  //       console.log("Completed Inpatients.");
  //     });
  // });

  // Payments
  await new Promise(async (resolve) => {
    console.log("Beginning Payments.");
    let dataPath = "csv/payment.txt";
    let logFile = "logs/payment.txt";
    let stream = fs
      .createReadStream(dataPath)
      .pipe(csvParser({ separator: "|" }))
      .on("data", async (row, i) => {
        stream.pause();
        var resultObj = {
          id: row["Payment #"],
          guarantorId: row["Guarantor #"],
          insurancePlanId: !!row["Plan / Carrier"]
            ? row["Plan / Carrier"]
            : null,
          postDate: dateParser(row["Post Date"]),
          referenceDate: dateParser(row["Reference Date"]),
          amount: parseFloat(row["Amount"]),
          voucherId: row["Voucher #"],
          visitId: row["Legacy ID"],
          notes: row["Payment Note"],
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
            logFile,
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
        stream.resume();
      })
      .on("end", async () => {
        resolve();
        console.log("Completed Payments.");
      });
  });

  // Charges
  await new Promise(async (resolve) => {
    console.log("Beginning Charges.");
    let dataPath = "csv/charge.txt";
    let logFile = "logs/charge.txt";
    let stream = fs
      .createReadStream(dataPath)
      .pipe(csvParser({ separator: "|" }))
      .on("data", async (row, i) => {
        stream.pause();
        var resultObj = {
          visitId: row["Visit #"],
          providerId: !!row["Performing Provider"]
            ? row["Performing Provider"]
            : null,
          procedureId: row["Procedure"],
          amount: parseFloat(row["Amount"]),
          fromServiceDate: dateParser(row["From Service Date"]),
          toServiceDate: dateParser(row["To Service Date"]),
          postDate: dateParser(row["Post Date"]),
          approvedAmount: row["Approved Amount"],
          legacyId: row["Legacy ID"],
          supervisingProvider: row["Supervising Provider"],
          lineNumber: row["Line #"],
          placeOfService: row["Place of Service"],
          diagId: row["Diagnosis 1"],
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
            logFile,
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
        stream.resume();
      })
      .on("end", async () => {
        resolve();
        console.log("Completed Charges.");
      });
  });

  // Assignments
  await new Promise(async (resolve) => {
    console.log("Beginning Assignments.");
    let dataPath = "csv/assign.txt";
    let logFile = "logs/assign.txt";
    let stream = fs
      .createReadStream(dataPath)
      .pipe(csvParser({ separator: "|" }))
      .on("data", async (row, i) => {
        stream.pause();
        var resultObj = {
          visitId: row["Visit #"],
          chargeLine: row["Charge Line #"],
          activityCount: row["Activity Count"],
          assingmentType: row["Assignment Type"],
          paymentId: !!row["Payment #"] ? row["Payment #"] : null,
          amount: parseFloat(row["Amount"]),
          postDate: dateParser(row["Post Date"]),
          glAccountCodeId: !!row["GL Account Tag"]
            ? row["GL Account Tag"]
            : null,
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
            logFile,
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
        stream.resume();
      })
      .on("end", async () => {
        resolve();
        console.log("Completed Assignments.");
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
