const BIDefaultModel = require('../BIDefaultModel');
module.exports = sequelize => {
  const CostCenterBalance = sequelize.define('CostCenterBalance', BIDefaultModel);
  return CostCenterBalance;
};
