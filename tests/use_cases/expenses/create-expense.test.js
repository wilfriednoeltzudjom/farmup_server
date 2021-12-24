const { expect } = require('chai');

const dependencies = require('../../../src/infrastructure');
const createExpenseUseCase = require('../../../src/use_cases/expenses/create-expense.usecase')(dependencies);
const { BandFactory, ExpenseFactory } = require('../../../src/database/factories');
const { ResourceNotFoundError, BadRequestError } = require('../../../src/application/helpers/errors');

describe('UseCase - Expenses - Create expense', () => {
  beforeEach(async function () {
    this.band = await BandFactory.createBand();
    this.expenseFactoryData = { quantity: 10, unitPrice: 5000 };
    this.expenseFactoryOptions = { quantity: { skip: false }, unitPrice: { skip: false } };
  });

  it('should fail without the category', async function () {
    await expect(
      createExpenseUseCase.execute({ bandId: this.band.id, ...ExpenseFactory.generateExpense({}, { ...this.expenseFactoryOptions, category: { skip: true } }) })
    ).to.be.eventually.rejectedWith(BadRequestError, /category/);
  });

  it('should fail without the date', async function () {
    await expect(createExpenseUseCase.execute({ bandId: this.band.id, ...ExpenseFactory.generateExpense({}, { ...this.expenseFactoryOptions, date: { skip: true } }) })).to.be.eventually.rejectedWith(
      BadRequestError,
      /date/
    );
  });

  it('should fail without the quantity', async function () {
    await expect(
      createExpenseUseCase.execute({ bandId: this.band.id, ...ExpenseFactory.generateExpense({}, { ...this.expenseFactoryOptions, quantity: { skip: true } }) })
    ).to.be.eventually.rejectedWith(BadRequestError, /quantity/);
  });

  it('should fail without the unit price', async function () {
    await expect(
      createExpenseUseCase.execute({ bandId: this.band.id, ...ExpenseFactory.generateExpense({}, { ...this.expenseFactoryOptions, unitPrice: { skip: true } }) })
    ).to.be.eventually.rejectedWith(BadRequestError, /unitPrice/);
  });

  it('should fail if there is no band related to provided bandId', async function () {
    await expect(createExpenseUseCase.execute(ExpenseFactory.generateExpense(this.expenseFactoryData, this.expenseFactoryOptions))).to.be.eventually.rejectedWith(ResourceNotFoundError);
  });

  it('should succeed and save a new expense', async function () {
    const expense = await expect(createExpenseUseCase.execute({ bandId: this.band.id, ...ExpenseFactory.generateExpense(this.expenseFactoryData, this.expenseFactoryOptions) })).to.be.fulfilled;
    expect(expense.totalPrice).to.be.eql(50000);
    expect(expense.code).to.eql('EX00001');
  });
});
