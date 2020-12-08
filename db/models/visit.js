"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Visit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Visit.belongsTo(models.Patient, {
        foreignKey: "patientNumber",
        targetKey: "patientNumber",
        as: "patient",
      });
      Visit.hasMany(models.Charge, {
        foreignKey: "visitNumber",
        sourceKey: "visitNumber",
        as: "charge",
      });
      Visit.hasMany(models.PlanCoverage, {
        foreignKey: "visitNumber",
        sourceKey: "visitNumber",
        as: "planCoverage",
      });
      Visit.hasMany(models.Payment, {
        foreignKey: "legacyId",
        sourceKey: "legacyId",
        as: "payment",
      });
    }
  }
  Visit.init(
    {
      visitNumber: DataTypes.STRING,
      visitDate: DataTypes.DATE,
      patientNumber: DataTypes.STRING,
      legacyId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Visit",
    }
  );
  return Visit;
};
