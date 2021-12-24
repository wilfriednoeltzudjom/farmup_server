const { Expense } = require('../../database/models');
const { findBandById } = require('../bands/helpers/band.helper');
const { formatExpenseData, findExpenseById } = require('./helpers/expense.helper');

module.exports = function buildCreateExpenseUseCase(dependencies) {
  const { dataValidator } = dependencies;

  async function execute({ bandId, ...data } = {}) {
    validateData(data);
    formatExpenseData(data);

    const band = await findBandById(bandId);
    const expense = new Expense({ ...data, band, farm: band.farm });
    await setExpenseCode(expense, band);
    await expense.save();

    return findExpenseById(expense.id);
  }

  function validateData({ category, title, comment, date, quantity, unitPrice, assets }) {
    dataValidator.validateStringAsRequired(category, 'Expense category');
    dataValidator.validateString(title, 'Expense title');
    dataValidator.validateString(comment, 'Expense comment');
    dataValidator.validateDateAsRequired(date, 'Expense date');
    dataValidator.validateNumberAsRequired(quantity, 'Expense quantity');
    dataValidator.validateNumberAsRequired(unitPrice, 'Expense unitPrice');
    dataValidator.validateArray(assets, 'Expense assets');
  }

  async function setExpenseCode(expense, band) {
    const expenses = await Expense.find({ band }).sort({ createdAt: -1 }).limit(1);
    let nextExpensePosition = 0;
    if (expenses.length > 0) {
      nextExpensePosition = Number(expenses[0].code.slice(2));
    }
    expense.code = 'EX'.concat(String(nextExpensePosition + 1).padStart(5, '0'));
  }

  return { execute };
};
