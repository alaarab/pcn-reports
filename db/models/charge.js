"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Charge extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Charge.belongsTo(models.Visit, {
        foreignKey: "visitNumber",
        as: "visit",
      });
    }
  }
  Charge.init(
    {
      visitNumber: DataTypes.STRING,
      procedure: DataTypes.STRING,
      provider: DataTypes.STRING,
      amount: DataTypes.DECIMAL,
      approvedAmount: DataTypes.DECIMAL,
      legacyId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Charge",
    }
  );
  return Charge;
};
