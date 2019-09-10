const FinancialTransaction = require('../../models/financial/FinancialTransaction').default;
const BaseService = require('../BaseService').default;

export default class FinancialTransactionService extends BaseService {
  constructor(route) {
    const financialTransaction = new FinancialTransaction();
    super(financialTransaction.mongooseModel(), '/financial/transaction');
  }
}
