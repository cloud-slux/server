const mongoose = require('mongoose');
const BaseModel = require('./BaseModel').default;

export default class Company extends BaseModel {
  constructor() {
    const CompanySchema = new mongoose.Schema({
      code: {type: String, unique: true, required:true},
      name: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    });

    super(CompanySchema, 'Company');
  }
}
