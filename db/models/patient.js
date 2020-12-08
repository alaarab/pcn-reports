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
        sourceKey: "patientId",
        foreignKey: "patientId",
        as: "visit",
      });
      Patient.hasMany(models.PatientPlan, {
        sourceKey: "patientId",
        foreignKey: "patientId",
        as: "patientPlan",
      });
    }
  }
  Patient.init(
    {
      id: DataTypes.STRING,
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
