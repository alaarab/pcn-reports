"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PatientPlan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PatientPlan.belongsTo(models.Patient, {
        foreignKey: "patientNumber",
        as: "patient",
      });
    }
  }
  PatientPlan.init(
    {
      patientNumber: DataTypes.STRING,
      insurancePlanNumber: DataTypes.STRING,
      groupNumber: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "PatientPlan",
    }
  );
  return PatientPlan;
};
