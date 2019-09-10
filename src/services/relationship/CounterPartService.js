const CounterPart = require('../../models/relationship/CounterPart').default;
const BaseService = require('../BaseService').default;

export default class CounterPartService extends BaseService {
  constructor() {
    const counterPart = new CounterPart();
    super(counterPart.mongooseModel(), '/relationship/counterPart');
  }
}
