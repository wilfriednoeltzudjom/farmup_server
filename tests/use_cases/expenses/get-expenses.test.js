const { expect } = require('chai');

const dependencies = require('../../../src/infrastructure');
const getExpensesUseCase = require('../../../src/use_cases/expenses/get-expenses.usecase')(dependencies);
const { BandFactory, ExpenseFactory } = require('../../../src/database/factories');
const { ResourceNotFoundError } = require('../../../src/application/helpers/errors');

describe('UseCase - Expenses - Get expenses', () => {
  beforeEach(async function () {
    this.band = await BandFactory.createBand();
  });

  it('should fail if there is no band related to the provided bandId', async function () {
    await expect(getExpensesUseCase.execute()).to.be.eventually.rejectedWith(ResourceNotFoundError);
  });

  it('should return an empty array if there is no expenses related to the provided bandId', async function () {
    const expenses = await expect(getExpensesUseCase.execute({ bandId: this.band.id })).to.be.fulfilled;
    expect(expenses).to.have.lengthOf(0);
  });

  it('should properly return all existing expenses', async function () {
    await Promise.all(
      Array(5)
        .fill()
        .map((_, index) => {
          const expenseData = {};
          if (index % 2 === 0) expenseData.band = this.band;

          return ExpenseFactory.createExpense(expenseData);
        })
    );

    const expenses = await expect(getExpensesUseCase.execute({ bandId: this.band.id })).to.be.fulfilled;
    expect(expenses).to.have.lengthOf(3);
  });
});
