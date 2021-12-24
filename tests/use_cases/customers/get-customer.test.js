const { expect } = require('chai');

const dependencies = require('../../../src/infrastructure');
const getCustomerUseCase = require('../../../src/use_cases/customers/get-customer.usecase')(dependencies);
const { CustomerFactory } = require('../../../src/database/factories');
const { ResourceNotFoundError } = require('../../../src/application/helpers/errors');
const { isNonEmptyObject } = require('../../../src/application/helpers/types.helper');

describe('UseCase - Customers - Get customer', () => {
  it('should fail without the type', async function () {
    await expect(getCustomerUseCase.execute()).to.be.eventually.rejectedWith(ResourceNotFoundError);
  });

  it('should succeed and return the found customer', async function () {
    const customer = await CustomerFactory.createCustomer();

    const foundCustomer = await expect(getCustomerUseCase.execute({ customerId: customer.id })).to.be.fulfilled;
    expect(isNonEmptyObject(foundCustomer)).to.eql(true);
  });
});
