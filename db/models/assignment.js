"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Assignment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Assignment.belongsTo(models.Visit, {
        foreignKey: "visitId",
        as: "visit",
      });
      Assignment.belongsTo(models.glAccountCode, {
        foreignKey: "glAccountCodeId",
        as: "glAccountCode",
      });
      Assignment.belongsTo(models.Payment, {
        foreignKey: "paymentId",
        as: "payment",
      });
    }
  }
  Assignment.init(
    {
      visitId: DataTypes.STRING,
      chargeLine: DataTypes.INTEGER,
      activityCount: DataTypes.INTEGER,
      assingmentType: DataTypes.STRING,
      paymentId: DataTypes.STRING,
      amount: {
        type: DataTypes.DECIMAL,
        get() {
          const value = this.getDataValue("amount");
          return value === null ? null : parseFloat(value);
        },
      },
      postDate: DataTypes.DATE,
      glAccountCodeId: DataTypes.STRING,
      unappliedCreditNumber: DataTypes.STRING,
      transferToInsuranceCreditedPlan: DataTypes.STRING,
      legacyId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Assignment",
    }
  );
  return Assignment;
};
