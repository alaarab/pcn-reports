"use strict";
var fs = require("fs");
var csv = require("csv");
var models = require("./db/models");
var parser = csv.parse({
  columns: true,
  relax_column_count: true,
});

// GUARANTORS

// console.log("Beginning Guarantors...");

// var guarantorInput = fs.createReadStream("csv/guarantors.csv");
// var transform = csv.transform(function (row) {
//   // since id was being difficult
//   let id = row[Object.keys(row)[0]];

//   var resultObj = {
//     id: id,
//     ssn: row["ssn"],
//     firstName: row["firstName"],
//     middleName: row["middleName"],
//     lastName: row["lastName"],
//     sex: row["sex"],
//     dob: dateParser(row["dob"]),
//     address: row["address"],
//     zip: row["zip"],
//     city: row["city"],
//     state: row["state"],
//     phone: row["phone"],
//     workPhone: row["workPhone"],
//   };
//   models.Guarantor.create(resultObj)
//     .then(function () {
//       console.log("Record created");
//     })
//     .catch(function (err) {
//       console.log("Error encountered: " + err);
//     });
// });

// guarantorInput.pipe(parser).pipe(transform);

// console.log("Completed Guarantors.");

// PATIENTS

// console.log("Beginning Patients...");

// var patientInput = fs.createReadStream("csv/patients.csv");
// var transform = csv.transform(function (row) {
//   // since id was being difficult
//   let id = row[Object.keys(row)[0]];

//   var resultObj = {
//     id: id,
//     guarantorId: row["guarantorId"],
//     ssn: row["ssn"],
//     firstName: row["firstName"],
//     middleName: row["middleName"],
//     lastName: row["lastName"],
//     sex: row["sex"],
//     dob: dateParser(row["dob"]),
//     address: row["address"],
//     zip: row["zip"],
//     city: row["city"],
//     state: row["state"],
//     phone: row["phone"],
//     workPhone: row["workPhone"],
//     // lastDateOfService: dateParser(row["dob"]),
//     // insurance: row["insurance"],
//     // balance: row["balance"],
//     // unappliedInsuranceBalance: row["unappliedInsuranceBalance"],
//     // registrationDate: row["registrationDate"],
//     // class: row["class"],
//   };

//   models.Patient.create(resultObj)
//     .then(function () {
//       console.log("Record created");
//     })
//     .catch(function (err) {
//       console.log("Error encountered: " + err);
//     });
// });

// patientInput.pipe(parser).pipe(transform);

// console.log("Completed Patients.");

// LOCATIONS

// console.log("Beginning Locations...");

// var locationInput = fs.createReadStream("csv/locations.csv");
// var transform = csv.transform(function (row) {

//   // since id was being difficult
//   let id = row[Object.keys(row)[0]];

//   var resultObj = {
//     id: id,
//     description: row['description'],
//     address: row['address'],
//     zip: row['zip'],
//     city: row['city'],
//     state: row['state'],
//     phoneNumber: row['phoneNumber'],
//     npi: row['npi'],
//   };

//   models.Location.create(resultObj)
//     .then(function () {
//       console.log("Record created");
//     })
//     .catch(function (err) {
//       console.log("Error encountered: " + err);
//     });
// });

// locationInput.pipe(parser).pipe(transform);

// console.log("Completed Locations.");

// glAccount Codes

console.log("Beginning glAccountCodes...");

var glAccountCodeInput = fs.createReadStream("csv/glacctcode.csv");
var transform = csv.transform(function (row) {
  // since id was being difficult
  let id = row[Object.keys(row)[0]];

  var resultObj = {
    id: id,
    class: row["class"],
    description: row["description"],
  };

  models.glAccountCode
    .create(resultObj)
    .then(function () {
      console.log("Record created");
    })
    .catch(function (err) {
      console.log("Error encountered: " + err);
    });
});

glAccountCodeInput.pipe(parser).pipe(transform);

console.log("Completed glAccountCodes.");

// Providers

// console.log("Beginning providers...");

// var providerInput = fs.createReadStream("csv/providers.csv");
// var transform = csv.transform(function (row) {
//   // since id was being difficult
//   let id = row[Object.keys(row)[0]];

//   var resultObj = {
//     id: id,
//     firstName: row["firstName"],
//     lastName: row["lastName"],
//   };

//   models.Provider
//     .create(resultObj)
//     .then(function () {
//       console.log("Record created");
//     })
//     .catch(function (err) {
//       console.log("Error encountered: " + err);
//     });
// });

// providerInput.pipe(parser).pipe(transform);

// console.log("Completed providers.");

// VISITS
console.log("Beginning Visits...");

var visitInput = fs.createReadStream("csv/visits.csv");
var transform = csv.transform(function (row) {

  // since id was being difficult
  let id = row[Object.keys(row)[0]];

  var resultObj = {
    id: id,
    patientId: row['patientId'],
    guarantorId: row['guarantorId'],
    locationId: row['locationId'],
    providerId: row['providerId'],
    claimId: row['claimId'],
    legacyId: row['id'],
  };

  models.Visit.create(resultObj)
    .then(function () {
      console.log("Record created");
    })
    .catch(function (err) {
      console.log("Error encountered: " + err);
    });
});

visitInput.pipe(parser).pipe(transform);

console.log("Completed Visits.");

function dateParser(dateStr) {
  if (!dateStr) return null;

  let year = dateStr.substr(0, 4);
  let month = dateStr.substr(4, 2);
  let day = dateStr.substr(6, 2);

  let date = new Date(`${year}-${month}-${day}`);

  return date;
}
