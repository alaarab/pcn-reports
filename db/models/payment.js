"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Payment.belongsTo(models.Visit, {
        foreignKey: "legacyId",
        as: "visit",
      });
    }
  }
  Payment.init(
    {
      id: DataTypes.STRING,
      guarantorId: DataTypes.STRING,
      plan: DataTypes.STRING,
      postDate: DataTypes.DATE,
      referenceDate: DataTypes.DATE,
      amount: DataTypes.DECIMAL,
      voucherId: DataTypes.STRING,
      legacyId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Payment",
    }
  );
  return Payment;
};
