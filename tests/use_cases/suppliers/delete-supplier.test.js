const { expect } = require('chai');

const dependencies = require('../../../src/infrastructure');
const deleteSupplierUseCase = require('../../../src/use_cases/suppliers/delete-supplier.usecase')(dependencies);
const getSupplierUseCase = require('../../../src/use_cases/suppliers/get-supplier.usecase')(dependencies);
const { SupplierFactory, ExpenseFactory } = require('../../../src/database/factories');
const { ResourceNotFoundError, BadRequestError } = require('../../../src/application/helpers/errors');

describe('UseCase - Suppliers - Delete supplier', () => {
  beforeEach(function () {
    this.expenseFactoryOptions = { quantity: { skip: false }, unitPrice: { skip: false } };
  });

  it('should fail without the type', async function () {
    await expect(deleteSupplierUseCase.execute()).to.be.eventually.rejectedWith(ResourceNotFoundError);
  });

  it('should fail if there is at least one expense related to the supplier', async function () {
    const supplier = await SupplierFactory.createSupplier({});
    await ExpenseFactory.createExpense({ supplier }, this.expenseFactoryOptions);

    await expect(deleteSupplierUseCase.execute({ supplierId: supplier.id })).to.be.eventually.rejectedWith(BadRequestError);
  });

  it('should succeed and return the deleted supplier', async function () {
    const supplier = await SupplierFactory.createSupplier();

    await expect(deleteSupplierUseCase.execute({ supplierId: supplier.id })).to.be.fulfilled;
    await expect(getSupplierUseCase.execute({ supplierId: supplier.id })).to.be.eventually.rejectedWith(ResourceNotFoundError);
  });
});
