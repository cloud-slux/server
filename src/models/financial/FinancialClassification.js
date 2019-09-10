const mongoose = require('mongoose');
const BaseModel = require('../BaseModel').default;

export default class FinancialClassification extends BaseModel {
  constructor() {
    const FinancialClassificationSchema = new mongoose.Schema({
      description: String,
      code: {type: String, unique: true, required:true},
      type: String,
      class: String,
      parent: String,
      codeParent: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    });

    super(FinancialClassificationSchema, 'FinancialClassification');
  }
}
