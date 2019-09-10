const FinancialClassification = require('../../models/financial/FinancialClassification').default;
const BaseService = require('../BaseService').default;

export default class FinancialClassificationService extends BaseService {
  constructor() {
    const financialClassification = new FinancialClassification();
    super(financialClassification.mongooseModel(), '/financial/classification');
  }
}
