'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Visit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Visit.belongsTo(models.Patient, {foreignKey: 'patientNumber', as: 'patient'})
    }
  };
  Visit.init({
    visitNumber: DataTypes.STRING,
    middleName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    dob: DataTypes.DATE,
    patientNumber: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Visit',
  });
  return Visit;
};