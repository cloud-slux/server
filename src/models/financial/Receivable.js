const mongoose = require('mongoose');
const BaseModel = require('../BaseModel').default;
const ObjectId = mongoose.Schema.Types.ObjectId;

export default class Receivable extends BaseModel {
  constructor() {

    const ReceivableSchema = new mongoose.Schema({
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
        ref: 'ReceivableInstallment'
      }],
      createdAt: {
        type: Date,
        default: Date.now
      }
    });

    const ReceivableInstallmentSchema = new mongoose.Schema({
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

    super(ReceivableSchema, 'Receivable');
  }
}
