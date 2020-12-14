'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Guarantor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Guarantor.init({
    ssn: DataTypes.STRING,
    firstName: DataTypes.STRING,
    middleName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    sex: DataTypes.STRING,
    dob: DataTypes.DATE,
    address: DataTypes.STRING,
    zip: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    phone: DataTypes.STRING,
    workPhone: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Guarantor',
  });
  return Guarantor;
};