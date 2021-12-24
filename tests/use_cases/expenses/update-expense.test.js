const { expect } = require('chai');

const dependencies = require('../../../src/infrastructure');
const updateExpenseUseCase = require('../../../src/use_cases/expenses/update-expense.usecase')(dependencies);
const { ExpenseFactory } = require('../../../src/database/factories');
const { ResourceNotFoundError } = require('../../../src/application/helpers/errors');

describe('UseCase - Expenses - Update expense', () => {
  it('should fail if there is no expense related to the provided id', async function () {
    await expect(updateExpenseUseCase.execute()).to.be.eventually.rejectedWith(ResourceNotFoundError);
  });

  it('should properly update an existing expense', async function () {
    const expense = await ExpenseFactory.createExpense();
    const expenseUpdateData = { quantity: 10, unitPrice: 10000 };

    const updatedExpense = await expect(updateExpenseUseCase.execute({ expenseId: expense.id, ...expenseUpdateData })).to.be.fulfilled;
    expect(updatedExpense.quantity).to.be.eql(expenseUpdateData.quantity);
    expect(updatedExpense.unitPrice).to.be.eql(expenseUpdateData.unitPrice);
    expect(updatedExpense.totalPrice).to.be.eql(100000);
  });
});
