const Sequelize = require('sequelize');

const BIDefaultModel = {
  originId:{ type: Sequelize.DataTypes.STRING, primaryKey: true, autoIncrement: false },
  originName: Sequelize.DataTypes.STRING,
  id: { type: Sequelize.DataTypes.STRING, primaryKey: true, autoIncrement: false },
  date: { type: Sequelize.DataTypes.DATEONLY, primaryKey: true, autoIncrement: false },
  description: Sequelize.DataTypes.STRING,
  beforeBalance: Sequelize.DataTypes.DECIMAL,
  inputs: Sequelize.DataTypes.DECIMAL,
  outputs: Sequelize.DataTypes.DECIMAL,
  balance: Sequelize.DataTypes.DECIMAL
};

module.exports = BIDefaultModel;
