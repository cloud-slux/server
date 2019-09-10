const mongoose = require('mongoose');
const BaseModel = require('../BaseModel').default;

export default class FinancialClassification extends BaseModel {
  constructor() {
    const FinancialAccountSchema = new mongoose.Schema({
      description: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    });

    super(FinancialAccountSchema, 'FinancialAccount');
  }
}
