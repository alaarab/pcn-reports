"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Provider extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Provider.hasMany(models.Visit, {
        foreignKey: "providerId",
        targetKey: "id",
        as: "visit",
      });
      Provider.hasMany(models.Charge, {
        foreignKey: "providerId",
        targetKey: "id",
        as: "charge",
      });
    }
  }
  Provider.init(
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Provider",
    }
  );
  return Provider;
};
