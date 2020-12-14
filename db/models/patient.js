"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Patient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Patient.hasMany(models.Visit, {
        sourceKey: "id",
        foreignKey: "patientId",
        as: "visit",
      });
      Patient.hasMany(models.PatientPlan, {
        sourceKey: "id",
        foreignKey: "patientId",
        as: "patientPlan",
      });
      Patient.belongsTo(models.Guarantor, {
        sourceKey: "guarantorId",
        as: "guarantor",
      });
    }
  }
  Patient.init(
    {
      firstName: DataTypes.STRING,
      middleName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      dob: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Patient",
    }
  );
  return Patient;
};
