const { factory } = require('fakingoose');

const { Expense } = require('../../models');

const factoryOptions = {
  quantity: { skip: true },
  unitPrice: { skip: true },
  totalPrice: { skip: true },
};

module.exports = function buildExpenseFactory({ defaultOptions }) {
  function generateExpense(data = {}, options = {}) {
    return Object.assign(factory(Expense, { ...defaultOptions, ...factoryOptions, ...options }).generate(), data);
  }

  async function createExpense(data = {}, options = {}) {
    const expense = await new Expense(generateExpense(data, options));

    return expense.save();
  }

  return { generateExpense, createExpense };
};
