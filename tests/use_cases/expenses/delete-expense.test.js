const { expect } = require('chai');

const dependencies = require('../../../src/infrastructure');
const deleteExpenseUseCase = require('../../../src/use_cases/expenses/delete-expense.usecase')(dependencies);
const getExpenseUseCase = require('../../../src/use_cases/expenses/get-expense.usecase')(dependencies);
const { ExpenseFactory, AssetFactory } = require('../../../src/database/factories');
const { ResourceNotFoundError } = require('../../../src/application/helpers/errors');

describe('UseCase - Expenses - Delete expense', () => {
  it('should fail if there is no expense related to the provided id', async function () {
    await expect(deleteExpenseUseCase.execute()).to.be.eventually.rejectedWith(ResourceNotFoundError);
  });

  it('should properly delete an existing expense', async function () {
    const expense = await ExpenseFactory.createExpense();

    await expect(deleteExpenseUseCase.execute({ expenseId: expense.id })).to.be.fulfilled;
    await expect(getExpenseUseCase.execute({ expenseId: expense.id })).to.be.eventually.rejectedWith(ResourceNotFoundError);
  });

  it('should properly delete an expense including its assets', async function () {
    const expense = await ExpenseFactory.createExpense({ assets: Array(2).fill().map(AssetFactory.generateAsset) });

    await expect(deleteExpenseUseCase.execute({ expenseId: expense.id })).to.be.fulfilled;
    expect(global.stubs.fileManager.deleteFile).to.have.been.calledTwice;
  });
});
