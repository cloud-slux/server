const BIDefaultModel = require('../BIDefaultModel');
module.exports = sequelize => {
  const FinancialClassificationBalance = sequelize.define('FinancialClassificationBalance', BIDefaultModel);
  return FinancialClassificationBalance;
};
