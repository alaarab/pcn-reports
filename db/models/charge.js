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
        foreignKey: "visitId",
        as: "visit",
      });
      Charge.belongsTo(models.Procedure, {
        foreignKey: "procedureId",
        as: "procedure",
      });
      Charge.belongsTo(models.Provider, {
        foreignKey: "providerId",
        as: "provider",
      });
    }
  }
  Charge.init(
    {
      visitId: DataTypes.STRING,
      procedureId: DataTypes.STRING,
      providerId: DataTypes.STRING,
      legacyId: DataTypes.STRING,
      supervisingProvider: DataTypes.STRING,
      amount: {
        type: DataTypes.DECIMAL,
        get() {
          const value = this.getDataValue("amount");
          return value === null ? null : parseFloat(value);
        },
      },
      approvedAmount: {
        type: DataTypes.DECIMAL,
        get() {
          const value = this.getDataValue("approvedAmount");
          return value === null ? null : parseFloat(value);
        },
      },
      placeOfService: DataTypes.STRING,
      lineNumber: DataTypes.INTEGER,
      fromServiceDate: DataTypes.DATE,
      toServiceDate: DataTypes.DATE,
      postDate: DataTypes.DATE,
      generalNote: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Charge",
    }
  );
  return Charge;
};
