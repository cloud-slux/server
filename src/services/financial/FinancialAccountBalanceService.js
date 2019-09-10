const FinancialBalanceController = require('../../controllers/financial/FinancialBalanceController');

module.exports = {

  async index(req, res){

    const { date } = req.body;

    const ok = await FinancialBalanceController.recalculateFinancialBalance(date);

   if(ok){
     return res.sendStatus(200);
   }else{
    return res.sendStatus(401);
   }

  }
};
