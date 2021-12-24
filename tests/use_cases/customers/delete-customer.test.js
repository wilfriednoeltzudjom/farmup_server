const { expect } = require('chai');

const dependencies = require('../../../src/infrastructure');
const deleteCustomerUseCase = require('../../../src/use_cases/customers/delete-customer.usecase')(dependencies);
const getCustomerUseCase = require('../../../src/use_cases/customers/get-customer.usecase')(dependencies);
const { CustomerFactory, SaleFactory } = require('../../../src/database/factories');
const { ResourceNotFoundError, BadRequestError } = require('../../../src/application/helpers/errors');

describe('UseCase - Customers - Delete customer', () => {
  it('should fail without the type', async function () {
    await expect(deleteCustomerUseCase.execute()).to.be.eventually.rejectedWith(ResourceNotFoundError);
  });

  it('should fail if there is at least one sale related to the customer', async function () {
    const customer = await CustomerFactory.createCustomer();
    await SaleFactory.createSale({ customer });

    await expect(deleteCustomerUseCase.execute({ customerId: customer.id })).to.be.eventually.rejectedWith(BadRequestError);
  });

  it('should succeed and return the deleted customer', async function () {
    const customer = await CustomerFactory.createCustomer();

    await expect(deleteCustomerUseCase.execute({ customerId: customer.id })).to.be.fulfilled;
    await expect(getCustomerUseCase.execute({ customerId: customer.id })).to.be.eventually.rejectedWith(ResourceNotFoundError);
  });
});
