const mongoose = require('mongoose');
const BaseModel = require('../BaseModel').default;

export default class PaymentDischarge extends BaseModel {
  constructor() {

    const PaymentDischargeSchema = new mongoose.Schema({
      companyId: String,
      companyName: String,
      description: String,
      date: Date,
      avaibalityDate: Date,
      type: String,
      financialAccountId: String,
      financialAccountName: String,
      financialClassificationId: String,
      financialClassificationName: String,
      costCenterId: String,
      costCenterName: String,
      baseValue: Number,
      interest: Number,
      penalty: Number,
      discount: Number,
      otherFees: Number,
      otherDiscounts: Number,
      finalvalue: Number,
      createdAt: {
        type: Date,
        default: Date.now
      }
    });

    super(PaymentDischargeSchema, 'PaymentDischarge');
  }
}

