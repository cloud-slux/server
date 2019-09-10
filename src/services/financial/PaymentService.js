const Payment = require('../../models/financial/Payment').default;
const BaseService = require('../BaseService').default;

export default class PaymentService extends BaseService {
  constructor() {
    const payment = new Payment();
    super(payment.mongooseModel(), '/financial/payment');
  }
}
