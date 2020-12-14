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
        foreignKey: "patientId",
        targetKey: "id",
        as: "patient",
      });
      Visit.hasMany(models.Charge, {
        foreignKey: "visitId",
        sourceKey: "id",
        as: "charge",
      });
      Visit.hasMany(models.PlanCoverage, {
        foreignKey: "visitId",
        sourceKey: "id",
        as: "planCoverage",
      });
      Visit.hasMany(models.Payment, {
        foreignKey: "legacyId",
        sourceKey: "legacyId",
        as: "payment",
      });
      Visit.hasMany(models.Assignment, {
        foreignKey: "visitId",
        sourceKey: "id",
        as: "assignment",
      });
    }
  }
  Visit.init(
    {
      visitDate: DataTypes.DATE,
      patientId: DataTypes.STRING,
      legacyId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Visit",
    }
  );
  return Visit;
};
