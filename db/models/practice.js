"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Practice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Practice.hasMany(models.Guarantor, {
      //   foreignKey: "guarantorId",
      //   sourceKey: "id",
      //   as: "guarantor",
      // });
      Practice.hasMany(models.Patient, {
        foreignKey: 'practiceId',
        as: 'patients',
      });
      Practice.hasMany(models.Guarantor, {
        foreignKey: 'practiceId',
        as: 'guarantors',
      });
    }
  }
  Practice.init(
    {
      name: DataTypes.STRING
    },
    {
      sequelize,
      modelName: "Practice",
    }
  );
  return Practice;
};
