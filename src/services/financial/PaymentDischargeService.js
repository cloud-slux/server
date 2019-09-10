const PaymentDischarge = require('../../models/financial/PaymentDischarge').default;
const BaseService = require('../BaseService').default;

export default class PaymentDischargeService extends BaseService {
  constructor() {
    const paymentDischarge = new PaymentDischarge();
    super(paymentDischarge.mongooseModel(), '/financial/paymentDischarge');
  }
}
