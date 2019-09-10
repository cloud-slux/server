const CostCenter = require('../../models/management/CostCenter').default;
const BaseService = require('../BaseService').default;

export default class CostCenterService extends BaseService {
  constructor() {
    const costCenter = new CostCenter();
    super(costCenter.mongooseModel(), '/management/costCenter');
  }
}

