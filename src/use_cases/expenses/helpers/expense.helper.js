const { ResourceNotFoundError } = require('../../../application/helpers/errors');
const { isNonEmptyObject } = require('../../../application/helpers/types.helper');
const { Expense } = require('../../../database/models');

async function findExpenseById(expenseId) {
  const expense = await Expense.findById(expenseId).populate('supplier');
  if (!expense) throw new ResourceNotFoundError(`No expense found for id: ${expenseId}`);

  return expense;
}

function formatExpenseData(data) {
  if (isNonEmptyObject(data.supplier)) {
    data.supplier = data.supplier.id;
  }

  return data;
}

module.exports = { findExpenseById, formatExpenseData };
