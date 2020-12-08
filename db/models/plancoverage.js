"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PlanCoverage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PlanCoverage.belongsTo(models.Visit, {
        foreignKey: "visitId",
        as: "visit",
      });
    }
  }
  PlanCoverage.init(
    {
      visitId: DataTypes.STRING,
      legacyId: DataTypes.STRING,
      groupId: DataTypes.STRING,
      performingProvider: DataTypes.STRING,
      procedure: DataTypes.STRING,
      amount: DataTypes.DECIMAL,
    },
    {
      sequelize,
      modelName: "PlanCoverage",
    }
  );
  return PlanCoverage;
};
