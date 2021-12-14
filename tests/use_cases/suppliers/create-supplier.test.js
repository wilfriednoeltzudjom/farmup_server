const { expect } = require('chai');

const dependencies = require('../../../src/infrastructure');
const createSupplierUseCase = require('../../../src/use_cases/suppliers/create-supplier.usecase')(dependencies);
const { FarmFactory, SupplierFactory } = require('../../../src/database/factories');
const { BadRequestError } = require('../../../src/application/helpers/errors');
const { SUPPLIER_TYPES } = require('../../../src/database/enums');

describe('UseCase - Suppliers - Create supplier', () => {
  beforeEach(async function () {
    this.farm = await FarmFactory.createFarm();
  });

  it('should fail without the type', async function () {
    await expect(createSupplierUseCase.execute({ farmId: this.farm.id, ...SupplierFactory.generateSupplier({}, { type: { skip: true } }) })).to.be.eventually.rejectedWith(BadRequestError, /type/i);
  });

  it('should fail if the email is already taken', async function () {
    const supplier = await SupplierFactory.createSupplier();

    await expect(createSupplierUseCase.execute({ farmId: this.farm.id, ...SupplierFactory.generateSupplier({ email: supplier.email }) })).to.be.eventually.rejectedWith(BadRequestError, /email/i);
  });

  it('should fail if the phone is already taken', async function () {
    const supplier = await SupplierFactory.createSupplier();

    await expect(createSupplierUseCase.execute({ farmId: this.farm.id, ...SupplierFactory.generateSupplier({ phone: supplier.phone }) })).to.be.eventually.rejectedWith(BadRequestError, /téléphone/i);
  });

  context('case of a company', () => {
    beforeEach(function () {
      this.supplierData = { type: SUPPLIER_TYPES.COMPANY };
    });

    it('should fail without the name', async function () {
      await expect(createSupplierUseCase.execute({ farmId: this.farm.id, ...SupplierFactory.generateSupplier(this.supplierData, { name: { skip: true } }) })).to.be.eventually.rejectedWith(
        BadRequestError,
        /name/
      );
    });

    it('should succeed an create a new supplier', async function () {
      const supplier = await expect(createSupplierUseCase.execute({ farmId: this.farm.id, ...SupplierFactory.generateSupplier(this.supplierData, { code: { skip: true } }) })).to.be.fulfilled;
      expect(supplier.code).to.eql('FO00001');
    });
  });

  context('case of an individual', () => {
    beforeEach(function () {
      this.supplierData = { type: SUPPLIER_TYPES.INDIVIDUAL };
    });

    it('should fail without the lastName', async function () {
      await expect(createSupplierUseCase.execute({ farmId: this.farm.id, ...SupplierFactory.generateSupplier(this.supplierData, { lastName: { skip: true } }) })).to.be.eventually.rejectedWith(
        BadRequestError,
        /lastName/
      );
    });

    it('should succeed an create a new supplier', async function () {
      await expect(createSupplierUseCase.execute({ farmId: this.farm.id, ...SupplierFactory.generateSupplier(this.supplierData) })).to.be.fulfilled;
    });
  });
});
