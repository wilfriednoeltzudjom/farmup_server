const { expect } = require('chai');

const dependencies = require('../../../src/infrastructure');
const getSuppliersAnalyticsUseCase = require('../../../src/use_cases/suppliers/get-suppliers-analytics.usecase')(dependencies);
const { FarmFactory, SupplierFactory } = require('../../../src/database/factories');
const { ResourceNotFoundError } = require('../../../src/application/helpers/errors');
const { SUPPLIER_TYPES } = require('../../../src/database/enums');

describe('UseCase - Suppliers - Get suppliers analytics', () => {
  it('should throw an error if there is no farm related to the provided farmId', async function () {
    await expect(getSuppliersAnalyticsUseCase.execute()).to.be.eventually.rejectedWith(ResourceNotFoundError);
  });

  it('should properly return analytics when there is no suppliers', async function () {
    const farm = await FarmFactory.createFarm();

    const analytics = await expect(getSuppliersAnalyticsUseCase.execute({ farmId: farm.id })).to.be.fulfilled;
    expect(analytics.counts.individuals).to.eql(0);
    expect(analytics.counts.companies).to.eql(0);
    expect(analytics.counts.total).to.eql(0);
  });

  it('should properly return analytics when there is different suppliers types', async function () {
    const farm = await FarmFactory.createFarm();
    await Promise.all(
      [SUPPLIER_TYPES.COMPANY, SUPPLIER_TYPES.COMPANY, SUPPLIER_TYPES.INDIVIDUAL, SUPPLIER_TYPES.INDIVIDUAL, SUPPLIER_TYPES.COMPANY, SUPPLIER_TYPES.COMPANY, SUPPLIER_TYPES.INDIVIDUAL].map(
        (type, index) => {
          const supplierData = { type };
          if (index % 2 === 0) supplierData.farm = farm;
          return SupplierFactory.createSupplier(supplierData);
        }
      )
    );

    const analytics = await expect(getSuppliersAnalyticsUseCase.execute({ farmId: farm.id })).to.be.fulfilled;
    expect(analytics.counts.individuals).to.eql(2);
    expect(analytics.counts.companies).to.eql(2);
    expect(analytics.counts.total).to.eql(4);
  });
});
