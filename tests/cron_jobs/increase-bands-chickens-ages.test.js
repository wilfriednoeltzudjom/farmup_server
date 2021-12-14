const { expect } = require('chai');

const { increaseBandsChickensAgesCronJob } = require('../../src/cron_jobs');
const { BandFactory, FarmFactory, DayFactory } = require('../../src/database/factories');
const { BAND_STATUSES } = require('../../src/database/enums');
const { dateUtils } = require('../../src/infrastructure');

describe('Cron Job - Increase bands chickens ages', () => {
  afterEach(function () {
    dateUtils.resetDate();
  });

  it('should properly update chickens ages', async function () {
    const { band } = await createBandTestData();
    dateUtils.mockDate(dateUtils.add({ amount: 5 }));

    await expect(increaseBandsChickensAgesCronJob.execute()).to.be.fulfilled;

    const updatedBand = await band.refresh();

    expect(updatedBand.chickensCurrentAge).to.eql(16);
  });

  async function createBandTestData({ bandData = {} } = {}) {
    const farm = await FarmFactory.createFarm();
    const band = await BandFactory.createBand({ status: BAND_STATUSES.RUNNING, chickensStartAge: 1, startedAt: dateUtils.substract({ amount: 10 }), chickensCurrentAge: 11, farm, ...bandData });
    await DayFactory.createDay({ chickensAge: 11, band });

    return { band };
  }
});
