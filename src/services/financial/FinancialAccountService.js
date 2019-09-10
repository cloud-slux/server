const FinancialAccount = require('../../models/financial/FinancialAccount').default;
const BaseService = require('../BaseService').default;

export default class FinancialAccountService extends BaseService {
  constructor() {
    const financialAccount = new FinancialAccount();
    super(financialAccount.mongooseModel(), '/financial/account');
  }
}
