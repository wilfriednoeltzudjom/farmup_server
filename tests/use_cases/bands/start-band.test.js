const { expect } = require('chai');

const dependencies = require('../../../src/infrastructure');
const startBandUseCase = require('../../../src/use_cases/bands/start-band.usecase')(dependencies);
const { BandFactory, FarmFactory } = require('../../../src/database/factories');
const { ResourceNotFoundError, BadRequestError } = require('../../../src/application/helpers/errors');
const { BAND_STATUSES } = require('../../../src/database/enums');

describe('UseCase - Bands - Start band', () => {
  const { dateUtils, dataUtils } = dependencies;

  beforeEach(async function () {
    this.farm = await FarmFactory.createFarm();
    this.band = await BandFactory.createBand({ status: BAND_STATUSES.PENDING, farm: this.farm });
    this.data = {
      startedAt: dateUtils.now(),
      chickensStartCount: 10,
      chickensStartAge: 17,
    };
  });

  it('should fail without startedAt', async function () {
    delete this.data.startedAt;

    await expect(startBandUseCase.execute({ bandId: this.band.id, ...this.data })).to.be.eventually.rejectedWith(BadRequestError, /startedAt/);
  });

  it('should fail without chickensStartAge', async function () {
    delete this.data.chickensStartAge;

    await expect(startBandUseCase.execute({ bandId: this.band.id, ...this.data })).to.be.eventually.rejectedWith(BadRequestError, /chickensStartAge/);
  });

  it('should fail without chickensStartCount', async function () {
    delete this.data.chickensStartCount;

    await expect(startBandUseCase.execute({ bandId: this.band.id, ...this.data })).to.be.eventually.rejectedWith(BadRequestError, /chickensStartCount/);
  });

  it('should fail if there is no band related to the provided id', async function () {
    await expect(startBandUseCase.execute(this.data)).to.be.eventually.rejectedWith(ResourceNotFoundError);
  });

  it('should fail if the band is not pending', async function () {
    const status = dataUtils.getRandomArrayValue([BAND_STATUSES.RUNNING, BAND_STATUSES.CANCELLED, BAND_STATUSES.ENDED]);
    const band = await BandFactory.createBand({ status });

    await expect(startBandUseCase.execute({ bandId: band.id, ...this.data })).to.be.eventually.rejectedWith(BadRequestError, `You can only start a pending band. Your band status is ${status}.`);
  });

  it('should succeed and start an existing band', async function () {
    const band = await expect(startBandUseCase.execute({ bandId: this.band.id, ...this.data })).to.be.fulfilled;
    expect(band.status).to.eql(BAND_STATUSES.RUNNING);
    expect(band.chickensStartAge).to.eql(this.data.chickensStartAge);
    expect(band.chickensStartCount).to.eql(this.data.chickensStartCount);
  });
});
