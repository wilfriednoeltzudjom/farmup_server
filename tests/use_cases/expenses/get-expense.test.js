const { expect } = require('chai');

const dependencies = require('../../../src/infrastructure');
const getExpenseUseCase = require('../../../src/use_cases/expenses/get-expense.usecase')(dependencies);
const { ExpenseFactory, SupplierFactory } = require('../../../src/database/factories');
const { ResourceNotFoundError } = require('../../../src/application/helpers/errors');

describe('UseCase - Expenses - Get expense', () => {
  it('should fail if there is no expense related to the provided id', async function () {
    await expect(getExpenseUseCase.execute()).to.be.eventually.rejectedWith(ResourceNotFoundError);
  });

  it('should properly return an existing expense', async function () {
    const supplier = await SupplierFactory.createSupplier();
    const expense = await ExpenseFactory.createExpense({ supplier });

    const foundExpense = await expect(getExpenseUseCase.execute({ expenseId: expense.id })).to.be.fulfilled;
    expect(foundExpense.supplier.id).to.be.eql(supplier.id);
  });
});
