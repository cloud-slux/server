const BICompanyModel = require('../BICompanyModel');
module.exports = sequelize => {
  const FinancialAccountBalanceCompany = sequelize.define('FinancialAccountBalanceCompany', BICompanyModel);
  return FinancialAccountBalanceCompany;
};
