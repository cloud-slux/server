const mongoose = require('mongoose');
const BaseModel = require('../BaseModel').default;

export default class FinancialTransaction extends BaseModel {
  constructor() {
    const FinancialTransactionSchema = new mongoose.Schema({
      companyId: String,
      companyName: String,
      type: String,
      origin: String,
      date: Date,
      description:String,
      creditAccountId: String,
      creditAccountName: String,
      creditClassificationId: String,
      creditClassificationName: String,
      creditCostCenterId: String,
      creditCostCenterName: String,
      creditValue: Number,
      debitAccountId: String,
      debitAccountName: String,
      debitClassificationId: String,
      debitClassificationName: String,
      debitCostCenterId: String,
      debitCostCenterName: String,
      debitValue: Number
    });

    super(FinancialTransactionSchema, 'FinancialTransaction');
  }
}
