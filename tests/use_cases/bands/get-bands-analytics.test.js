const { expect } = require('chai');

const dependencies = require('../../../src/infrastructure');
const getBandsAnalyticsUseCase = require('../../../src/use_cases/bands/get-bands-analytics.usecase')(dependencies);
const { FarmFactory, BandFactory, ExpenseFactory, SaleFactory } = require('../../../src/database/factories');
const { ResourceNotFoundError } = require('../../../src/application/helpers/errors');
const { BAND_STATUSES } = require('../../../src/database/enums');

describe('UseCase - Bands - Get bands analytics', () => {
  it('should fail if there is no farm related to the provided id', async function () {
    await expect(getBandsAnalyticsUseCase.execute()).to.be.eventually.rejectedWith(ResourceNotFoundError);
  });

  it('should succeed and return the appropriate analytics (counts analytics)', async function () {
    const farm = await FarmFactory.createFarm();
    await Promise.all(
      [BAND_STATUSES.PENDING, BAND_STATUSES.PENDING, BAND_STATUSES.RUNNING, BAND_STATUSES.CANCELLED, BAND_STATUSES.ENDED, BAND_STATUSES.ENDED].map((status) => BandFactory.createBand({ status, farm }))
    );
    const analytics = await expect(getBandsAnalyticsUseCase.execute({ farmId: farm.id })).to.be.fulfilled;
    expect(analytics.counts.pending).to.eql(2);
    expect(analytics.counts.running).to.eql(1);
    expect(analytics.counts.cancelled).to.eql(1);
    expect(analytics.counts.ended).to.eql(2);
    expect(analytics.counts.total).to.eql(6);
  });

  it('should succeed and return the apporpriate analytics (amounts)', async function () {
    const farm = await FarmFactory.createFarm();
    const band = await BandFactory.createBand({ status: BAND_STATUSES.RUNNING, farm });
    await Promise.all(
      [
        { quantity: 1, unitPrice: 100 },
        { quantity: 1, unitPrice: 50, band },
        { quantity: 1, unitPrice: 200, band },
      ].map((data) => ExpenseFactory.createExpense(data))
    );
    await Promise.all(
      [
        { quantity: 1, unitPrice: 100 },
        { quantity: 1, unitPrice: 200, band },
        { quantity: 1, unitPrice: 400, band },
      ].map((data) => SaleFactory.createSale(data))
    );

    const analytics = await expect(getBandsAnalyticsUseCase.execute({ farmId: farm.id })).to.be.fulfilled;
    expect(analytics.amounts.totalExpenses).to.eql(250);
    expect(analytics.amounts.totalSales).to.eql(600);
    expect(analytics.amounts.turnover).to.eql(350);
  });
});
