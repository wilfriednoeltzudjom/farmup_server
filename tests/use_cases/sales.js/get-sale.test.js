const { expect } = require('chai');

const dependencies = require('../../../src/infrastructure');
const getSaleUseCase = require('../../../src/use_cases/sales/get-sale.usecase')(dependencies);
const { SaleFactory, CustomerFactory } = require('../../../src/database/factories');
const { ResourceNotFoundError } = require('../../../src/application/helpers/errors');

describe('UseCase - Sales - Get sale', () => {
  it('should fail if there is no sale related to the provided id', async function () {
    await expect(getSaleUseCase.execute()).to.be.eventually.rejectedWith(ResourceNotFoundError);
  });

  it('should properly return an existing sale', async function () {
    const customer = await CustomerFactory.createCustomer();
    const sale = await SaleFactory.createSale({ customer });

    const foundSale = await expect(getSaleUseCase.execute({ saleId: sale.id })).to.be.fulfilled;
    expect(foundSale.customer.id).to.be.eql(customer.id);
  });
});
