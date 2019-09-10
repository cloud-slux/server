const mongoose = require('mongoose');
const BaseModel = require('../BaseModel').default;

export default class CostCenter extends BaseModel {
  constructor() {
    const CostCenterSchema = new mongoose.Schema({
      description: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    });

    super(CostCenterSchema, 'CostCenter');
  }
}
