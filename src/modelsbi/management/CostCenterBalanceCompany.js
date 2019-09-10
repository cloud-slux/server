const BICompanyModel = require('../BICompanyModel');
module.exports = sequelize => {
  const CostCenterBalanceCompany = sequelize.define('CostCenterBalanceCompany', BICompanyModel);
  return CostCenterBalanceCompany;
};
