const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

export default class BaseModel {
  constructor(mongooseSchema, name){
    this.mongooseSchema = mongooseSchema;
    this.name = name;
    this.mongooseModel = this.mongooseModel.bind(this);
  }

  mongooseModel(){
    this.mongooseSchema.plugin(mongoosePaginate);
    return mongoose.model(this.name, this.mongooseSchema);
  }
}
