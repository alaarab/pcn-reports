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
        foreignKey: "patientId",
        as: "patient",
      });
      // define association here
      PatientPlan.belongsTo(models.InsurancePlan, {
        foreignKey: "insurancePlanId",
        as: "insurancePlan",
      });

    }
  }
  PatientPlan.init(
    {
      patientId: DataTypes.STRING,
      insurancePlanId: DataTypes.STRING,
      groupId: DataTypes.STRING,
      memberId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "PatientPlan",
    }
  );
  return PatientPlan;
};
