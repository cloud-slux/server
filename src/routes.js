const express = require('express');

const routes = express.Router();

const CompanyService = require('./services/CompanyService').default;

const XFilterQueryOtimizer = require('./utils/expressionsParsers/XFilter/XFilterQueryOtimizer').default;

const ServiceLoader = require('./services/ServiceLoader').default;

const FinancialAccountBalanceService = require('./services/financial/FinancialAccountBalanceService');

routes.get('/', (req, res) => {
  return res.send('Hello world');
});

const serviceLoader = new ServiceLoader();
serviceLoader.init();

serviceLoader.modules.forEach(module => {
  serviceLoader.getControllers(module).forEach(fileObject => {
    fileObject.route(routes);
  });
});

const companyService = new CompanyService('/company');
companyService.route(routes);

routes.post('/financial/balance', FinancialAccountBalanceService.index);

// routes.get('/calculator', (req, res) => {
//   const q = req.query.q;

//   const calculator = require('./utils/expressionsParsers/SQLSAPExample/calculator');

//   const result = calculator(q);
//   res.send(result);
// });

// routes.get('/json', (req, res) => {
//   const json = require('./utils/expressionsParsers/SQLSAPExample/json');

//   const result = json.parse('{"teste": "teste"}');
//   res.send(result);
// });


const xFilterQueryOtimizer = new XFilterQueryOtimizer();
routes.get('/xfilter', (req, res) => {
  res.send(xFilterQueryOtimizer.Filter(req.query.q));
});

module.exports = routes;
