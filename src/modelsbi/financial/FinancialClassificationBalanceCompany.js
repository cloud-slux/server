const BICompanyModel = require('../BICompanyModel');
module.exports = sequelize => {
  const FinancialClassificationBalanceCompany = sequelize.define('FinancialClassificationBalanceCompany', BICompanyModel);
  return FinancialClassificationBalanceCompany;
};
