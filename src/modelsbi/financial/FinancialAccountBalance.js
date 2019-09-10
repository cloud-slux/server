const BIDefaultModel = require('../BIDefaultModel');
module.exports = sequelize => {
  const FinancialAccountBalance = sequelize.define('FinancialAccountBalance', BIDefaultModel);
  return FinancialAccountBalance;
};
