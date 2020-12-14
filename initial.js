"use strict";
var fs = require("fs");
var csv = require("csv");
var models = require("./db/models");
var parser = csv.parse({
  columns: true,
  relax: true,
});

// GUARANTORS

var input = fs.createReadStream("csv/guarantors.csv");
var transform = csv.transform(function (row) {

  // since id was being difficult 
  let id = row[Object.keys(row)[0]];

  var resultObj = {
    id: id,
    ssn: row['ssn'],
    firstName: row['firstName'],
    middleName: row['middleName'],
    lastName: row['lastName'],
    sex: row['sex'],
    dob: dateParser(row['dob']),
    address: row['address'],
    zip: row['zip'],
    city: row['city'],
    state: row['state'],
    phone: row['phone'],
    workPhone: row['workPhone'],
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






// PATIENTS

var input = fs.createReadStream("csv/patients.csv");
var transform = csv.transform(function (row) {

  // since id was being difficult 
  let guarantorId = row[Object.keys(row)[0]];

  var resultObj = {
    guarantorId: guarantorId,
    id: row['id'],
    ssn: row['ssn'],
    firstName: row['firstName'],
    middleName: row['middleName'],
    lastName: row['lastName'],
    sex: row['sex'],
    dob: dateParser(row['dob']),
    address: row['address'],
    zip: row['zip'],
    city: row['city'],
    state: row['state'],
    phone: row['phone'],
    workPhone: row['workPhone'],
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




function dateParser(dateStr){
  
  if (!dateStr) return null;

  let year = dateStr.substr(0,4)
  let month = dateStr.substr(4, 2)
  let day = dateStr.substr(6, 2)

  let date = new Date(`${year}-${month}-${day}`)

  return date;
}