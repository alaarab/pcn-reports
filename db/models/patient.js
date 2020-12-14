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
      sex: DataTypes.STRING,
      dob: DataTypes.DATE,
      address: DataTypes.STRING,
      guarantorId: DataTypes.STRING,
      zip: DataTypes.STRING,
      city: DataTypes.STRING,
      state: DataTypes.STRING,
      phone: DataTypes.STRING,
      workPhone: DataTypes.STRING,
      insurance: DataTypes.DECIMAL,
      balance: DataTypes.DECIMAL,
      unappliedInsuranceBalance: DataTypes.DECIMAL,
      registrationDate: DataTypes.DATE,
      class: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Patient",
    }
  );
  return Patient;
};
