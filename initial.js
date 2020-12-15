"use strict";
var fs = require("fs");
var csv = require("csv");
var models = require("./db/models");
var parser = csv.parse({
  columns: true,
  relax: true,
  relax_column_count: true,
});

// GUARANTORS

console.log("Beginning Guarantors...");

var input = fs.createReadStream("csv/guarantors.csv");
var transform = csv.transform(function (row) {
  // since id was being difficult
  let id = row[Object.keys(row)[0]];

  var resultObj = {
    id: id,
    ssn: row["ssn"],
    firstName: row["firstName"],
    middleName: row["middleName"],
    lastName: row["lastName"],
    sex: row["sex"],
    dob: dateParser(row["dob"]),
    address: row["address"],
    zip: row["zip"],
    city: row["city"],
    state: row["state"],
    phone: row["phone"],
    workPhone: row["workPhone"],
  };
  models.Guarantor.create(resultObj)
    .then(function () {
      console.log("Record created");
    })
    .catch(function (err) {
      console.log("Error encountered: " + err);
    });
});

input.pipe(parser).pipe(transform);

console.log("Completed Guarantors.");

// PATIENTS

console.log("Beginning Patients...");

var input = fs.createReadStream("csv/patients.csv");
var transform = csv.transform(function (row) {
  // since id was being difficult
  let guarantorId = row[Object.keys(row)[0]];

  var resultObj = {
    guarantorId: guarantorId,
    id: row["patientId"],
    ssn: row["ssn"],
    firstName: row["firstName"],
    middleName: row["middleName"],
    lastName: row["lastName"],
    sex: row["sex"],
    dob: dateParser(row["dob"]),
    address: row["address"],
    zip: row["zip"],
    city: row["city"],
    state: row["state"],
    phone: row["phone"],
    workPhone: row["workPhone"],
    lastDateOfService: row["lastDateOfService"],
    insurance: row["insurance"],
    balance: row["balance"],
    unappliedInsuranceBalance: row["unappliedInsuranceBalance"],
    registrationDate: row["registrationDate"],
    class: row["class"],
  };

  models.Patient.create(resultObj)
    .then(function () {
      console.log("Record created");
    })
    .catch(function (err) {
      console.log("Error encountered: " + err);
    });
});

input.pipe(parser).pipe(transform);

console.log("Completed Patients.");

// LOCATIONS

// console.log("Beginning Locations...");

// var input = fs.createReadStream("csv/locations.csv");
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

// input.pipe(parser).pipe(transform);

// console.log("Completed Locations.");

// glAccount Codes

console.log("Beginning glAccountCodes...");

console.log("glAccountCodes");

var input = fs.createReadStream("csv/glacctcode.csv");
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

input.pipe(parser).pipe(transform);

console.log("Completed glAccountCodes.");

// VISITS
// console.log("Beginning Visits...");

// var input = fs.createReadStream("csv/visits.csv");
// var transform = csv.transform(function (row) {

//   // since id was being difficult
//   let id = row[Object.keys(row)[0]];

//   var resultObj = {
//     id: id,
//     patientId: row['patientId'],
//     guarantorId: row['guarantorId'],
//     locationId: row['locationId'],
//     providerId: row['providerId'],
//     claimId: row['claimId'],
//     legacyId: row['id'],
//   };

//   models.Visit.create(resultObj)
//     .then(function () {
//       console.log("Record created");
//     })
//     .catch(function (err) {
//       console.log("Error encountered: " + err);
//     });
// });

// input.pipe(parser).pipe(transform);

// console.log("Completed Visits.");

function dateParser(dateStr) {
  if (!dateStr) return null;

  let year = dateStr.substr(0, 4);
  let month = dateStr.substr(4, 2);
  let day = dateStr.substr(6, 2);

  let date = new Date(`${year}-${month}-${day}`);

  return date;
}
