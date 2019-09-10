const Receivable = require('../../models/financial/Receivable').default;
const BaseService = require('../BaseService').default;

export default class ReceivableService extends BaseService {
  constructor() {
    const receivable = new Receivable();
    super(receivable.mongooseModel(), '/financial/receivable');
  }
}
