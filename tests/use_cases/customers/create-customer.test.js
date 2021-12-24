const { expect } = require('chai');

const dependencies = require('../../../src/infrastructure');
const createCustomerUseCase = require('../../../src/use_cases/customers/create-customer.usecase')(dependencies);
const { FarmFactory, CustomerFactory } = require('../../../src/database/factories');
const { BadRequestError } = require('../../../src/application/helpers/errors');
const { CUSTOMER_TYPES } = require('../../../src/database/enums');

describe('UseCase - Customers - Create customer', () => {
  beforeEach(async function () {
    this.farm = await FarmFactory.createFarm();
  });

  it('should fail without the type', async function () {
    await expect(createCustomerUseCase.execute({ farmId: this.farm.id, ...CustomerFactory.generateCustomer({}, { type: { skip: true } }) })).to.be.eventually.rejectedWith(BadRequestError, /type/i);
  });

  it('should fail if the email is already taken', async function () {
    const customer = await CustomerFactory.createCustomer();

    await expect(createCustomerUseCase.execute({ farmId: this.farm.id, ...CustomerFactory.generateCustomer({ email: customer.email }) })).to.be.eventually.rejectedWith(BadRequestError, /email/i);
  });

  it('should fail if the phone is already taken', async function () {
    const customer = await CustomerFactory.createCustomer();

    await expect(createCustomerUseCase.execute({ farmId: this.farm.id, ...CustomerFactory.generateCustomer({ phone: customer.phone }) })).to.be.eventually.rejectedWith(BadRequestError, /téléphone/i);
  });

  context('case of a company', () => {
    beforeEach(function () {
      this.customerData = { type: CUSTOMER_TYPES.COMPANY };
    });

    it('should fail without the name', async function () {
      await expect(createCustomerUseCase.execute({ farmId: this.farm.id, ...CustomerFactory.generateCustomer(this.customerData, { name: { skip: true } }) })).to.be.eventually.rejectedWith(
        BadRequestError,
        /name/
      );
    });

    it('should succeed an create a new customer', async function () {
      const customer = await expect(createCustomerUseCase.execute({ farmId: this.farm.id, ...CustomerFactory.generateCustomer(this.customerData, { code: { skip: true } }) })).to.be.fulfilled;
      expect(customer.code).to.eql('CU00001');
    });
  });

  context('case of an individual', () => {
    beforeEach(function () {
      this.customerData = { type: CUSTOMER_TYPES.INDIVIDUAL };
    });

    it('should fail without the lastName', async function () {
      await expect(createCustomerUseCase.execute({ farmId: this.farm.id, ...CustomerFactory.generateCustomer(this.customerData, { lastName: { skip: true } }) })).to.be.eventually.rejectedWith(
        BadRequestError,
        /lastName/
      );
    });

    it('should succeed an create a new customer', async function () {
      await expect(createCustomerUseCase.execute({ farmId: this.farm.id, ...CustomerFactory.generateCustomer(this.customerData) })).to.be.fulfilled;
    });
  });
});
