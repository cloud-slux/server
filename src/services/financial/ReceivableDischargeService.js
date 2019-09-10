const ReceivableDischarge = require('../../models/financial/ReceivableDischarge').default;
const BaseService = require('../BaseService').default;

export default class ReceivableDischargeService extends BaseService {
  constructor() {
    const receivableDischarge = new ReceivableDischarge();
    super(receivableDischarge.mongooseModel(), '/financial/receivableDischarge');
  }
}
