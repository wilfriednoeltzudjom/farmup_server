const { expect } = require('chai');

const dependencies = require('../../../src/infrastructure');
const getSuppliersUseCase = require('../../../src/use_cases/suppliers/get-suppliers.usecase')(dependencies);
const { FarmFactory, SupplierFactory } = require('../../../src/database/factories');
const { ResourceNotFoundError } = require('../../../src/application/helpers/errors');

describe('UseCase - Suppliers - Get suppliers', () => {
  it('should throw an error if there is no farm related to the provided farmId', async function () {
    await expect(getSuppliersUseCase.execute()).to.be.eventually.rejectedWith(ResourceNotFoundError);
  });

  it('should return an empty array if there is no suppliers related to the provided farmId', async function () {
    const farm = await FarmFactory.createFarm();
    const suppliers = await expect(getSuppliersUseCase.execute({ farmId: farm.id })).to.be.fulfilled;
    expect(suppliers).to.have.lengthOf(0);
  });

  it('should succeed and return the found suppliers', async function () {
    const farm = await FarmFactory.createFarm();
    await Promise.all(
      Array(5)
        .fill()
        .map((_, index) => {
          const supplierData = {};
          if (index % 2 === 0) supplierData.farm = farm;

          return SupplierFactory.createSupplier(supplierData);
        })
    );

    const foundSuppliers = await expect(getSuppliersUseCase.execute({ farmId: farm.id })).to.be.fulfilled;
    expect(foundSuppliers).to.have.lengthOf(3);
  });
});
