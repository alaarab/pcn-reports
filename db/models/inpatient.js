"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Inpatient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Inpatient.belongsTo(models.Visit, {
        foreignKey: "visitId",
        targetKey: "id",
        as: "visit",
      });
      Inpatient.belongsTo(models.Location, {
        foreignKey: "locationId",
        targetKey: "id",
        as: "location",
      });
      Inpatient.belongsTo(models.diagCode, {
        foreignKey: "diagId",
        targetKey: "id",
        as: "diagCode",
      });
      Inpatient.belongsTo(models.Provider, {
        foreignKey: "providerId",
        targetKey: "id",
        as: "provider",
      });
    }
  }
  Inpatient.init(
    {
      visitId: DataTypes.STRING,
      providerId: DataTypes.STRING,
      diagId: DataTypes.STRING,
      locationId: DataTypes.STRING,
      legacyId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Inpatient",
    }
  );
  return Inpatient;
};
