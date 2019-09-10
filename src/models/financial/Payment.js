const mongoose = require('mongoose');
const BaseModel = require('../BaseModel').default;
const ObjectId = mongoose.Schema.Types.ObjectId;

export default class Payment extends BaseModel {
  constructor() {
    const PaymentSchema = new mongoose.Schema({
      companyId: String,
      companyName: String,
      counterPartId: String,
      counterPartCode: String,
      counterPartName: String,
      counterPartType: String,
      financialClassificationId: String,
      financialClassificationDescription: String,
      costCenterId: String,
      costCenterName: String,
      description: String,
      emissionDate: Date,
      value: Number,
      openValue: Number,
      installment: [{
        type: ObjectId,
        ref: 'PaymentInstallment'
      }],
      createdAt: {
        type: Date,
        default: Date.now
      }
    });

    const PaymentInstallmentSchema = new mongoose.Schema({
      parcel: String,
      description: String,
      date: Date,
      financialAccountId: String,
      financialAccountName: String,
      value: Number,
      open: Boolean,
      openValue: Number,
      createdAt: {
        type: Date,
        default: Date.now
      }
    });

    super(PaymentSchema, 'Payment');
  }
}

// module.exports = mongoose.model('Payment', PaymentSchema);
// module.exports = mongoose.model('PaymentInstallment', PaymentInstallmentSchema);


