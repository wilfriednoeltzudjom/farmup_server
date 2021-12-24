const { expect } = require('chai');

const dependencies = require('../../../src/infrastructure');
const createSaleUseCase = require('../../../src/use_cases/sales/create-sale.usecase')(dependencies);
const { BandFactory, SaleFactory } = require('../../../src/database/factories');
const { ResourceNotFoundError, BadRequestError } = require('../../../src/application/helpers/errors');

describe('UseCase - Sales - Create sale', () => {
  beforeEach(async function () {
    this.band = await BandFactory.createBand({ chickensStartCount: 150, chickensDeathsCount: 1, chickensSalesCount: 10 });
    this.saleFactoryData = { quantity: 10, unitPrice: 5000 };
  });

  it('should fail without the date', async function () {
    await expect(createSaleUseCase.execute({ bandId: this.band.id, ...SaleFactory.generateSale({}, { ...this.saleFactoryOptions, date: { skip: true } }) })).to.be.eventually.rejectedWith(
      BadRequestError,
      /date/
    );
  });

  it('should fail without the quantity', async function () {
    await expect(createSaleUseCase.execute({ bandId: this.band.id, ...SaleFactory.generateSale({}, { ...this.saleFactoryOptions, quantity: { skip: true } }) })).to.be.eventually.rejectedWith(
      BadRequestError,
      /quantity/
    );
  });

  it('should fail without the unit price', async function () {
    await expect(createSaleUseCase.execute({ bandId: this.band.id, ...SaleFactory.generateSale({}, { ...this.saleFactoryOptions, unitPrice: { skip: true } }) })).to.be.eventually.rejectedWith(
      BadRequestError,
      /unitPrice/
    );
  });

  it('should fail if there is no band related to provided bandId', async function () {
    await expect(createSaleUseCase.execute(SaleFactory.generateSale(this.saleFactoryData, this.saleFactoryOptions))).to.be.eventually.rejectedWith(ResourceNotFoundError);
  });

  it('should fail if the remaining chickens count is less than the sale quantity', async function () {
    await expect(createSaleUseCase.execute({ bandId: this.band.id, ...SaleFactory.generateSale({ quantity: 140 }) })).to.be.eventually.rejectedWith(BadRequestError);
  });

  it('should succeed and save a new sale', async function () {
    const sale = await expect(createSaleUseCase.execute({ bandId: this.band.id, ...SaleFactory.generateSale(this.saleFactoryData, this.saleFactoryOptions) })).to.be.fulfilled;
    expect(sale.totalPrice).to.be.eql(50000);
    expect(sale.code).to.eql('SA00001');

    const updatedBand = await this.band.refresh();
    expect(updatedBand.chickensSalesCount).to.eql(20);
  });
});
