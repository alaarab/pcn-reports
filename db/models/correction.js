"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Correction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Correction.belongsTo(models.Patient, {
        foreignKey: "patientId",
        targetKey: "id",
        as: "patient",
      });
    }
  }
  Correction.init(
    {
      patientId: DataTypes.STRING,
      amount: DataTypes.DECIMAL,
      date: DataTypes.DATE,
      notes: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Correction",
    }
  );
  return Correction;
};
