const { expect } = require('chai');

const dependencies = require('../../../src/infrastructure');
const updateSupplierUseCase = require('../../../src/use_cases/suppliers/update-supplier.usecase')(dependencies);
const { SupplierFactory } = require('../../../src/database/factories');
const { BadRequestError } = require('../../../src/application/helpers/errors');

describe('UseCase - Suppliers - Update supplier', () => {
  beforeEach(async function () {
    this.supplier = await SupplierFactory.createSupplier();
  });

  it('should fail if the email is already taken', async function () {
    const supplier = await SupplierFactory.createSupplier();

    await expect(updateSupplierUseCase.execute({ supplierId: supplier.id, email: this.supplier.email })).to.be.eventually.rejectedWith(BadRequestError, /email/i);
  });

  it('should fail if the phone is already taken', async function () {
    const supplier = await SupplierFactory.createSupplier();

    await expect(updateSupplierUseCase.execute({ supplierId: supplier.id, phone: this.supplier.phone })).to.be.eventually.rejectedWith(BadRequestError, /téléphone/i);
  });

  it('should succeed and update supplier information', async function () {
    const supplier = await SupplierFactory.createSupplier({}, { email: { skip: true }, phone: { skip: true } });
    const { email, phone } = SupplierFactory.generateSupplier();

    const updatedSupplier = await expect(updateSupplierUseCase.execute({ supplierId: supplier.id, email, phone })).to.be.fulfilled;
    expect(updatedSupplier.email).to.eql(email);
    expect(updatedSupplier.phone).to.eql(phone);
  });
});
