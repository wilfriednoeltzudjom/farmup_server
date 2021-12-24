const { factory } = require('fakingoose');

const { Expense } = require('../../models');

const factoryOptions = {
  totalPrice: { skip: true },
};

module.exports = function buildExpenseFactory({ defaultOptions, dateUtils }) {
  function generateExpense(data = {}, options = {}) {
    const expense = Object.assign(factory(Expense, { ...defaultOptions, ...factoryOptions, ...options }).generate(), data);
    if (expense.date) expense.date = dateUtils.now();

    return expense;
  }

  async function createExpense(data = {}, options = {}) {
    const expense = new Expense(generateExpense(data, options));

    return expense.save();
  }

  return { generateExpense, createExpense };
};
