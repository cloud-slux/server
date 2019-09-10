const Company = require('../models/Company').default;
const BaseService = require('./BaseService').default;

export default class CompanyService extends BaseService {
  constructor(route) {
    const company = new Company();
    super(company.mongooseModel(), route);
  }
}
