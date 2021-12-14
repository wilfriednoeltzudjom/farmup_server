const { expect } = require('chai');

const dependencies = require('../../../src/infrastructure');
const cancelBandUseCase = require('../../../src/use_cases/bands/cancel-band.usecase')(dependencies);
const { BandFactory } = require('../../../src/database/factories');
const { ResourceNotFoundError, BadRequestError } = require('../../../src/application/helpers/errors');
const { BAND_STATUSES } = require('../../../src/database/enums');

describe('UseCase - Bands - Cancel band', () => {
  const { dataUtils } = dependencies;

  beforeEach(async function () {
    this.band = await BandFactory.createBand({ status: BAND_STATUSES.RUNNING });
    this.data = { comment: 'About why I decided to cancel a running band' };
  });

  it('should fail if there is no band related to the provided id', async function () {
    await expect(cancelBandUseCase.execute(this.data)).to.be.eventually.rejectedWith(ResourceNotFoundError);
  });

  it('should fail if the band is not running', async function () {
    const status = dataUtils.getRandomArrayValue([BAND_STATUSES.PENDING, BAND_STATUSES.CANCELLED, BAND_STATUSES.ENDED]);
    const band = await BandFactory.createBand({ status });

    await expect(cancelBandUseCase.execute({ bandId: band.id, ...this.data })).to.be.eventually.rejectedWith(BadRequestError, `You can only cancel a running band. Your band status is ${status}.`);
  });

  it('should succeed and cancel an existing running band', async function () {
    const band = await expect(cancelBandUseCase.execute({ bandId: this.band.id, ...this.data })).to.be.fulfilled;
    expect(band.status).to.eql(BAND_STATUSES.CANCELLED);
    expect(band.comment).to.eql(this.data.comment);
  });
});
