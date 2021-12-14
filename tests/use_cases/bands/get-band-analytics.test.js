const { expect } = require('chai');

const dependencies = require('../../../src/infrastructure');
const getBandAnalyticsUseCase = require('../../../src/use_cases/bands/get-band-analytics.usecase')(dependencies);
const { BandFactory, ExpenseFactory, SaleFactory } = require('../../../src/database/factories');
const { ResourceNotFoundError } = require('../../../src/application/helpers/errors');
const { BAND_STATUSES } = require('../../../src/database/enums');

describe('UseCase - Bands - Get bands analytics', () => {
  beforeEach(function () {
    this.data = {
      chickensStartCount: 300,
      chickensDeathsCount: 0,
      chickensDeathRate: 0,
      chickensStartAge: 21,
      chickensCurrentAge: 45,
    };
  });

  it('should fail if there is no band related to the provided id', async function () {
    await expect(getBandAnalyticsUseCase.execute()).to.be.eventually.rejectedWith(ResourceNotFoundError);
  });

  it('should succeed and return band analytics', async function () {
    const band = await BandFactory.createBand(this.data);

    const analytics = await expect(getBandAnalyticsUseCase.execute({ bandId: band.id })).to.be.fulfilled;
    expect(analytics.counts.total).to.eql(this.data.chickensStartCount);
    expect(analytics.counts.deaths).to.eql(this.data.chickensDeathsCount);
    expect(analytics.counts.deathRate).to.eql(this.data.chickensDeathRate);
    expect(analytics.ages.start).to.eql(this.data.chickensStartAge);
    expect(analytics.ages.current).to.eql(this.data.chickensCurrentAge);
    expect(analytics.amounts.totalExpenses).to.eql(0);
    expect(analytics.amounts.totalSales).to.eql(0);
    expect(analytics.amounts.turnover).to.eql(0);
  });

  it('should succeed and return band analytics', async function () {
    const band = await BandFactory.createBand({ ...this.data, status: BAND_STATUSES.ENDED });
    await Promise.all(
      [
        { quantity: 180, unitPrice: 1150, totalPrice: 207000 },
        { quantity: 1, unitPrice: 5000, totalPrice: 5000 },
      ].map((expenseData) => ExpenseFactory.createExpense({ ...expenseData, band }))
    );
    await Promise.all(
      [
        { quantity: 5, unitPrice: 4200, totalPrice: 21000 },
        { quantity: 50, unitPrice: 4500, totalPrice: 225000 },
        { quantity: 100, unitPrice: 4000, totalPrice: 400000 },
        { quantity: 24, unitPrice: 5000, totalPrice: 120000 },
      ].map((sale) => SaleFactory.createSale({ ...sale, band }))
    );

    const analytics = await expect(getBandAnalyticsUseCase.execute({ bandId: band.id })).to.be.fulfilled;
    expect(analytics.counts.total).to.eql(this.data.chickensStartCount);
    expect(analytics.counts.deaths).to.eql(this.data.chickensDeathsCount);
    expect(analytics.counts.deathRate).to.eql(this.data.chickensDeathRate);
    expect(analytics.ages.start).to.eql(this.data.chickensStartAge);
    expect(analytics.ages.current).to.eql(this.data.chickensCurrentAge);
    expect(analytics.amounts.totalExpenses).to.eql(212000);
    expect(analytics.amounts.totalSales).to.eql(766000);
    expect(analytics.amounts.turnover).to.eql(554000);
  });
});
