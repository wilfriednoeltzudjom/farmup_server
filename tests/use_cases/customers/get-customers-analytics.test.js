const { expect } = require('chai');

const dependencies = require('../../../src/infrastructure');
const getCustomersAnalyticsUseCase = require('../../../src/use_cases/customers/get-customers-analytics.usecase')(dependencies);
const { FarmFactory, CustomerFactory } = require('../../../src/database/factories');
const { ResourceNotFoundError } = require('../../../src/application/helpers/errors');
const { CUSTOMER_TYPES } = require('../../../src/database/enums');

describe('UseCase - Customers - Get customers analytics', () => {
  it('should throw an error if there is no farm related to the provided farmId', async function () {
    await expect(getCustomersAnalyticsUseCase.execute()).to.be.eventually.rejectedWith(ResourceNotFoundError);
  });

  it('should properly return analytics when there is no customers', async function () {
    const farm = await FarmFactory.createFarm();

    const analytics = await expect(getCustomersAnalyticsUseCase.execute({ farmId: farm.id })).to.be.fulfilled;
    expect(analytics.counts.individuals).to.eql(0);
    expect(analytics.counts.companies).to.eql(0);
    expect(analytics.counts.total).to.eql(0);
  });

  it('should properly return analytics when there is different customers types', async function () {
    const farm = await FarmFactory.createFarm();
    await Promise.all(
      [CUSTOMER_TYPES.COMPANY, CUSTOMER_TYPES.COMPANY, CUSTOMER_TYPES.INDIVIDUAL, CUSTOMER_TYPES.INDIVIDUAL, CUSTOMER_TYPES.COMPANY, CUSTOMER_TYPES.COMPANY, CUSTOMER_TYPES.INDIVIDUAL].map(
        (type, index) => {
          const customerData = { type };
          if (index % 2 === 0) customerData.farm = farm;
          return CustomerFactory.createCustomer(customerData);
        }
      )
    );

    const analytics = await expect(getCustomersAnalyticsUseCase.execute({ farmId: farm.id })).to.be.fulfilled;
    expect(analytics.counts.individuals).to.eql(2);
    expect(analytics.counts.companies).to.eql(2);
    expect(analytics.counts.total).to.eql(4);
  });
});
