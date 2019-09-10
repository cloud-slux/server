const FinancialTransaction = require('../../models/financial/FinancialTransaction');
const { FinancialAccountBalance } = require('../../modelsbi');
const { FinancialAccountBalanceCompany } = require('../../modelsbi');
const { FinancialClassificationBalance } = require('../../modelsbi');
const { FinancialClassificationBalanceCompany } = require('../../modelsbi');
const { CostCenterBalance } = require('../../modelsbi');
const { CostCenterBalanceCompany } = require('../../modelsbi');

async function recalculateTransactions(financialTransactions) {
  try {
    let dAccount = new Map();
    let dAccountCompany = new Map();
    let dClassification = new Map();
    let dClassificationCompany = new Map();
    let dCostCenter = new Map();
    let dCostCenterCompany = new Map();

    financialTransactions.forEach(financialTransaction =>
      recalculateIterator(
        financialTransaction,
        dAccount,
        dAccountCompany,
        dClassification,
        dClassificationCompany,
        dCostCenter,
        dCostCenterCompany
      )
    );

    for (var [key, value] of dAccount) {
      FinancialAccountBalance.create(value);
    }

    for (var [key, value] of dAccountCompany) {
      FinancialAccountBalanceCompany.create(value);
    }

    for (var [key, value] of dClassification) {
      FinancialClassificationBalance.create(value);
    }

    for (var [key, value] of dClassificationCompany) {
      FinancialClassificationBalanceCompany.create(value);
    }

    for (var [key, value] of dCostCenter) {
      CostCenterBalance.create(value);
    }

    for (var [key, value] of dCostCenterCompany) {
      CostCenterBalanceCompany.create(value);
    }

    return true;
  } catch (err) {
    console.log(`Erro:  ${err}`);
    console.trace();
    return false;
  }
};

function recalculateIterator  (
  financialTransaction,
  dAccount,
  dAccountCompany,
  dClassification,
  dClassificationCompany,
  dCostCenter,
  dCostCenterCompany
) {
  accountIterator(financialTransaction, dAccount, dAccountCompany);
  classificationIterator(financialTransaction, dClassification, dClassificationCompany);
  costCenterIterator(financialTransaction, dCostCenter, dCostCenterCompany);
};

function accountIterator(financialTransaction, dAccount, dAccountCompany)  {
  return balanceIterator(
    financialTransaction,
    dAccount,
    dAccountCompany,
    accountKeyTuplesFromTransaction,
    'creditAccountName',
    'debitAccountName'
  );
};

function classificationIterator (financialTransaction, dClassification, dClassificationCompany) {
  return balanceIterator(
    financialTransaction,
    dClassification,
    dClassificationCompany,
    classificationKeyTuplesFromTransaction,
    'creditClassificationName',
    'debitClassificationName'
  );
};

function costCenterIterator(financialTransaction, dCostCenter, dCostCenterCompany) {
  return balanceIterator(
    financialTransaction,
    dCostCenter,
    dCostCenterCompany,
    costCenterKeyTuplesFromTransaction,
    'creditCostCenterName',
    'debitCostCenterName'
  );
};

function balanceIterator  (
  financialTransaction,
  dictionary,
  dictionaryCompany,
  keyTuplesFromTransaction,
  descriptionCreditName,
  descriptionDebitName
)  {
  const keyTuples = keyTuplesFromTransaction(financialTransaction);

  keyTuples.map(keyTuple => {
    const type = keyTuple[0];
    const date = keyTuple[1];
    const id = keyTuple[2];
    const companyId = keyTuple[3];

    const key =
      date
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, '') + id;

    const companyKey = key + companyId;

    const descriptionName =
      type === 'C'
        ? financialTransaction[descriptionCreditName]
        : financialTransaction[descriptionDebitName];
    const value = type === 'C' ? financialTransaction.creditValue : financialTransaction.debitValue;

    let dayBalance;
    if (dictionary.has(key)) {
      dayBalance = dictionary.get(key);
    } else {
      dayBalance = {
        originId: 'test',
        originName: 'test',
        id: id,
        date: date.toISOString().slice(0, 10),
        description: descriptionName,
        beforeBalance: 0.0,
        inputs: 0.0,
        outputs: 0.0,
        balance: 0.0
      };
    }
    calculateBalance(dayBalance, type, value);
    dictionary.set(key, dayBalance);

    let dayBalanceCompany;
    if (dictionaryCompany.has(companyKey)) {
      dayBalanceCompany = dictionaryCompany.get(companyKey);
    } else {
      dayBalanceCompany = {
        originId: 'test',
        originName: 'test',
        companyId: companyId,
        companyName: financialTransaction.companyName,
        id: id,
        date: date.toISOString().slice(0, 10),
        description: descriptionName,
        beforeBalance: 0.0,
        inputs: 0.0,
        outputs: 0.0,
        balance: 0.0
      };
    }
    calculateBalance(dayBalanceCompany, type, value);
    dictionaryCompany.set(companyKey, dayBalanceCompany);
  });
};

function accountKeyTuplesFromTransaction (financialTransaction) {
  return keyTuplesFromTransaction(financialTransaction, 'creditAccountId', 'debitAccountId');
};

function classificationKeyTuplesFromTransaction (financialTransaction) {
  return keyTuplesFromTransaction(
    financialTransaction,
    'creditClassificationId',
    'debitClassificationId'
  );
};

function costCenterKeyTuplesFromTransaction (financialTransaction) {
  return keyTuplesFromTransaction(financialTransaction, 'creditCostCenterId', 'debitCostCenterId');
};

function keyTuplesFromTransaction (financialTransaction, creditFieldId, debitFieldId) {
  const { type, date, companyId } = financialTransaction;

  const creditId = financialTransaction[creditFieldId];
  const debitId = financialTransaction[debitFieldId];

  let keyTuples = [];
  if (type === 'C' && creditId !== '') {
    keyTuples.push(['C', date, creditId, companyId]);
  } else if (type === 'D' && debitId !== '') {
    keyTuples.push(['D', date, debitId, companyId]);
  } else if (type === 'T' && creditId !== '' && debitId !== '') {
    keyTuples.push(['C', date, debitId, companyId]);
    keyTuples.push(['D', date, debitId, companyId]);
  }
  return keyTuples;
};

function calculateBalance (dayBalance, type, value)  {
  let { inputs, outputs } = dayBalance;
  if (type === 'C') {
    inputs += value;
  } else {
    outputs += value;
  }

  dayBalance.inputs = inputs;
  dayBalance.outputs = outputs;
};

module.exports = {
  async recalculateFinancialBalance(date) {
    const financialTransactions = await FinancialTransaction.find({
      date: { $gte: date }
    }).sort({ originId: 1, companyId: 1, date: 1 });

    // const financialTransactions = await FinancialTransaction.find({
    //   $and: [
    //     { date: { $gte: date, $lte: finalDate } },
    //     { $or: [{ creditAccountId: accountId }, { debitAccountId: accountId }] }
    //   ]
    // }).sort('date');

    const ok = await recalculateTransactions(financialTransactions);

    return ok;
  }
};
