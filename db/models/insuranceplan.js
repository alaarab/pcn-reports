'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class InsurancePlan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  InsurancePlan.init({
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    zip: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    businessPhone: DataTypes.STRING,
    writedownAdjustmentCode: DataTypes.STRING,
    paymentProfileCode: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'InsurancePlan',
  });
  return InsurancePlan;
};