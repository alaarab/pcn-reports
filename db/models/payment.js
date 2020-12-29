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
        foreignKey: "visitId",
        as: "visit",
      });
      Payment.hasMany(models.Assignment, {
        foreignKey: "paymentId",
        as: "assignment",
      });
      Payment.belongsTo(models.InsurancePlan, {
        foreignKey: "insurancePlanId",
        as: "insurancePlan",
      });

    }
  }
  Payment.init(
    {
      guarantorId: DataTypes.STRING,
      insurancePlanId: DataTypes.STRING,
      postDate: DataTypes.DATE,
      referenceDate: DataTypes.DATE,
      amount: DataTypes.DECIMAL,
      voucherId: DataTypes.STRING,
      visitId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Payment",
    }
  );
  return Payment;
};
