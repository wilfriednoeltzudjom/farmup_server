const { expect } = require('chai');

const dependencies = require('../../../src/infrastructure');
const getSupplierUseCase = require('../../../src/use_cases/suppliers/get-supplier.usecase')(dependencies);
const { SupplierFactory } = require('../../../src/database/factories');
const { ResourceNotFoundError } = require('../../../src/application/helpers/errors');
const { isNonEmptyObject } = require('../../../src/application/helpers/types.helper');

describe('UseCase - Suppliers - Get supplier', () => {
  it('should fail without the type', async function () {
    await expect(getSupplierUseCase.execute()).to.be.eventually.rejectedWith(ResourceNotFoundError);
  });

  it('should succeed and return the found supplier', async function () {
    const supplier = await SupplierFactory.createSupplier();

    const foundSupplier = await expect(getSupplierUseCase.execute({ supplierId: supplier.id })).to.be.fulfilled;
    expect(isNonEmptyObject(foundSupplier)).to.eql(true);
  });
});
