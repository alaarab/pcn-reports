"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DiagCode extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      DiagCode.hasMany(models.Charge, {
        foreignKey: "diagId",
        targetKey: "id",
        as: "charge",
      });
      DiagCode.belongsTo(models.DiagCode, {
        foreignKey: "legacyId",
        targetKey: "id",
        as: "diagCodeLegacy",
      });
    }
  }
  DiagCode.init(
    {
      legacyId: DataTypes.STRING,
      description: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "DiagCode",
    }
  );
  return DiagCode;
};
