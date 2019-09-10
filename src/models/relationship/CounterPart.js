const mongoose = require('mongoose');
const BaseModel = require('../BaseModel').default;

export default class CounterPart extends BaseModel {
  constructor() {
    const CounterPartSchema = new mongoose.Schema({
      code: {type: String, unique: true, required:true},
      name: String,
      type: String,
      relationType: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    });

    super(CounterPartSchema, 'CounterPart');
  }
}
