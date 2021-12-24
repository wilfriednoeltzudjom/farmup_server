const { expect } = require('chai');

const dependencies = require('../../../src/infrastructure');
const getSalesUseCase = require('../../../src/use_cases/sales/get-sales.usecase')(dependencies);
const { BandFactory, SaleFactory } = require('../../../src/database/factories');
const { ResourceNotFoundError } = require('../../../src/application/helpers/errors');

describe('UseCase - Sales - Get sales', () => {
  beforeEach(async function () {
    this.band = await BandFactory.createBand();
  });

  it('should fail if there is no band related to the provided bandId', async function () {
    await expect(getSalesUseCase.execute()).to.be.eventually.rejectedWith(ResourceNotFoundError);
  });

  it('should return an empty array if there is no sales related to the provided bandId', async function () {
    const sales = await expect(getSalesUseCase.execute({ bandId: this.band.id })).to.be.fulfilled;
    expect(sales).to.have.lengthOf(0);
  });

  it('should properly return all existing sales', async function () {
    await Promise.all(
      Array(5)
        .fill()
        .map((_, index) => {
          const saleData = {};
          if (index % 2 === 0) saleData.band = this.band;

          return SaleFactory.createSale(saleData);
        })
    );

    const sales = await expect(getSalesUseCase.execute({ bandId: this.band.id })).to.be.fulfilled;
    expect(sales).to.have.lengthOf(3);
  });
});
