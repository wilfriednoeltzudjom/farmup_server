const { expect } = require('chai');

const dependencies = require('../../../src/infrastructure');
const updateSaleUseCase = require('../../../src/use_cases/sales/update-sale.usecase')(dependencies);
const { SaleFactory } = require('../../../src/database/factories');
const { ResourceNotFoundError } = require('../../../src/application/helpers/errors');

describe('UseCase - Sales - Update sale', () => {
  it('should fail if there is no sale related to the provided id', async function () {
    await expect(updateSaleUseCase.execute()).to.be.eventually.rejectedWith(ResourceNotFoundError);
  });

  it('should properly update an existing sale without updating the quantity', async function () {
    const sale = await SaleFactory.createSale({ quantity: 10 });
    const saleUpdateData = { quantity: 20, unitPrice: 10000 };

    const updatedSale = await expect(updateSaleUseCase.execute({ saleId: sale.id, ...saleUpdateData })).to.be.fulfilled;
    expect(updatedSale.unitPrice).to.be.eql(saleUpdateData.unitPrice);
    expect(updatedSale.totalPrice).to.be.eql(100000);
  });
});
