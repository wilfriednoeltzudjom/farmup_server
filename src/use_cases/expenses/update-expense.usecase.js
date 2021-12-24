const { findExpenseById, formatExpenseData } = require('./helpers/expense.helper');

module.exports = function buildUpdateExpenseUseCase() {
  async function execute({ expenseId, ...data } = {}) {
    const expense = await findExpenseById(expenseId);
    formatExpenseData(data);
    Object.assign(expense, data);
    await expense.save();

    return findExpenseById(expense.id);
  }

  return { execute };
};
