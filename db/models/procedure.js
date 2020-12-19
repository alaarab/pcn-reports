'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Procedure extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Procedure.hasMany(models.Charge, {
        foreignKey: "procedureId",
        as: "charge",
      });
    }
  };
  Procedure.init({
    displayId: DataTypes.STRING,
    description: DataTypes.STRING,
    type: DataTypes.STRING,
    amount: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'Procedure',
  });
  return Procedure;
};