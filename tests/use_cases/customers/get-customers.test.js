const { expect } = require('chai');

const dependencies = require('../../../src/infrastructure');
const getCustomersUseCase = require('../../../src/use_cases/customers/get-customers.usecase')(dependencies);
const { FarmFactory, CustomerFactory } = require('../../../src/database/factories');
const { ResourceNotFoundError } = require('../../../src/application/helpers/errors');

describe('UseCase - Customers - Get customers', () => {
  it('should throw an error if there is no farm related to the provided farmId', async function () {
    await expect(getCustomersUseCase.execute()).to.be.eventually.rejectedWith(ResourceNotFoundError);
  });

  it('should return an empty array if there is no customers related to the provided farmId', async function () {
    const farm = await FarmFactory.createFarm();
    const customers = await expect(getCustomersUseCase.execute({ farmId: farm.id })).to.be.fulfilled;
    expect(customers).to.have.lengthOf(0);
  });

  it('should succeed and return the found customers', async function () {
    const farm = await FarmFactory.createFarm();
    await Promise.all(
      Array(5)
        .fill()
        .map((_, index) => {
          const customerData = {};
          if (index % 2 === 0) customerData.farm = farm;

          return CustomerFactory.createCustomer(customerData);
        })
    );

    const foundCustomers = await expect(getCustomersUseCase.execute({ farmId: farm.id })).to.be.fulfilled;
    expect(foundCustomers).to.have.lengthOf(3);
  });
});
