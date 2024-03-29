"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class glAccountCode extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      glAccountCode.hasMany(models.Assignment, {
        foreignKey: "glAccountCodeId",
        as: "assignment",
      });
    }
  }
  glAccountCode.init(
    {
      class: DataTypes.STRING,
      description: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "glAccountCode",
    }
  );
  return glAccountCode;
};
