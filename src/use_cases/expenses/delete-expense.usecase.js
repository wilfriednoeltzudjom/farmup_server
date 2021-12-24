const { BadRequestError } = require('../../application/helpers/errors');
const { Expense } = require('../../database/models');
const { findExpenseById } = require('./helpers/expense.helper');

module.exports = function buildDeleteExpenseUseCase(dependencies) {
  const { fileManager } = dependencies;

  async function execute({ expenseId } = {}) {
    const expense = await findExpenseById(expenseId);
    const { deletedCount } = await Expense.deleteOne({ _id: expense.id });
    if (deletedCount !== 1) throw new BadRequestError(`Error while deleting expense: ${expenseId}`);
    await deleteAssets(expense);

    return expense;
  }

  async function deleteAssets({ assets = [] }) {
    return Promise.all(assets.map((asset) => fileManager.deleteFile(asset)));
  }

  return { execute };
};
