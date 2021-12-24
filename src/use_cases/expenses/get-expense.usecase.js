const { findExpenseById } = require('./helpers/expense.helper');

module.exports = function buildDeleteExpenseUseCase() {
  async function execute({ expenseId } = {}) {
    return findExpenseById(expenseId);
  }

  return { execute };
};
