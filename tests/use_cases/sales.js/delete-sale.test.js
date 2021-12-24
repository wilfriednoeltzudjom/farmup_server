const { expect } = require('chai');

const dependencies = require('../../../src/infrastructure');
const deleteSaleUseCase = require('../../../src/use_cases/sales/delete-sale.usecase')(dependencies);
const getSaleUseCase = require('../../../src/use_cases/sales/get-sale.usecase')(dependencies);
const { SaleFactory, BandFactory, AssetFactory } = require('../../../src/database/factories');
const { ResourceNotFoundError } = require('../../../src/application/helpers/errors');

describe('UseCase - Sales - Delete sale', () => {
  beforeEach(async function () {
    this.band = await BandFactory.createBand({ chickensSalesCount: 10 });
  });

  it('should fail if there is no sale related to the provided id', async function () {
    await expect(deleteSaleUseCase.execute()).to.be.eventually.rejectedWith(ResourceNotFoundError);
  });

  it('should properly delete an existing sale', async function () {
    const sale = await SaleFactory.createSale({ band: this.band });

    await expect(deleteSaleUseCase.execute({ saleId: sale.id })).to.be.fulfilled;
    await expect(getSaleUseCase.execute({ saleId: sale.id })).to.be.eventually.rejectedWith(ResourceNotFoundError);
  });

  it('should properly delete an sale including its assets', async function () {
    const sale = await SaleFactory.createSale({ assets: Array(2).fill().map(AssetFactory.generateAsset), band: this.band });

    await expect(deleteSaleUseCase.execute({ saleId: sale.id })).to.be.fulfilled;
    expect(global.stubs.fileManager.deleteFile).to.have.been.calledTwice;
  });

  it('should properly delete a sale and update its related band chickens sales count', async function () {
    const sale = await SaleFactory.createSale({ quantity: 2, band: this.band });

    await expect(deleteSaleUseCase.execute({ saleId: sale.id })).to.be.fulfilled;

    const updatedBand = await this.band.refresh();
    expect(updatedBand.chickensSalesCount).to.eql(8);
  });
});
