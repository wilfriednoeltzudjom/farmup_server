const { expect } = require('chai');

const dependencies = require('../../../src/infrastructure');
const updateCustomerUseCase = require('../../../src/use_cases/customers/update-customer.usecase')(dependencies);
const { CustomerFactory } = require('../../../src/database/factories');
const { BadRequestError } = require('../../../src/application/helpers/errors');

describe('UseCase - Customers - Update customer', () => {
  beforeEach(async function () {
    this.customer = await CustomerFactory.createCustomer();
  });

  it('should fail if the email is already taken', async function () {
    const customer = await CustomerFactory.createCustomer();

    await expect(updateCustomerUseCase.execute({ customerId: customer.id, email: this.customer.email })).to.be.eventually.rejectedWith(BadRequestError, /email/i);
  });

  it('should fail if the phone is already taken', async function () {
    const customer = await CustomerFactory.createCustomer();

    await expect(updateCustomerUseCase.execute({ customerId: customer.id, phone: this.customer.phone })).to.be.eventually.rejectedWith(BadRequestError, /téléphone/i);
  });

  it('should succeed and update customer information', async function () {
    const customer = await CustomerFactory.createCustomer({}, { email: { skip: true }, phone: { skip: true } });
    const { email, phone } = CustomerFactory.generateCustomer();

    const updatedCustomer = await expect(updateCustomerUseCase.execute({ customerId: customer.id, email, phone })).to.be.fulfilled;
    expect(updatedCustomer.email).to.eql(email);
    expect(updatedCustomer.phone).to.eql(phone);
  });
});
