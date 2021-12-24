const { expect } = require('chai');

const dependencies = require('../../../src/infrastructure');
const endBandUseCase = require('../../../src/use_cases/bands/end-band.usecase')(dependencies);
const { BandFactory } = require('../../../src/database/factories');
const { ResourceNotFoundError, BadRequestError } = require('../../../src/application/helpers/errors');
const { BAND_STATUSES } = require('../../../src/database/enums');

describe('UseCase - Bands - End band', () => {
  const { dateUtils } = dependencies;

  it('should fail if there is no band related to the provided id', async function () {
    await expect(endBandUseCase.execute()).to.be.eventually.rejectedWith(ResourceNotFoundError);
  });

  it('should fail if the status is pending', async function () {
    const band = await BandFactory.createBand({ status: BAND_STATUSES.PENDING });

    await expect(endBandUseCase.execute({ bandId: band.id })).to.be.eventually.rejectedWith(BadRequestError, /you can only end a running band/i);
  });

  it('should fail if the status is cancelled', async function () {
    const band = await BandFactory.createBand({ status: BAND_STATUSES.CANCELLED });

    await expect(endBandUseCase.execute({ bandId: band.id })).to.be.eventually.rejectedWith(BadRequestError, /you can only end a running band/i);
  });

  it('should fail if the status is already ended', async function () {
    const band = await BandFactory.createBand({ status: BAND_STATUSES.ENDED });

    await expect(endBandUseCase.execute({ bandId: band.id })).to.be.eventually.rejectedWith(BadRequestError, /you can only end a running band/i);
  });

  it('should fail if the status is running but the remaining chickens count has not reached 0', async function () {
    const band = await BandFactory.createBand({ status: BAND_STATUSES.RUNNING, chickensStartCount: 100, chickensDeathsCount: 0, chickensSalesCount: 99 });

    await expect(endBandUseCase.execute({ bandId: band.id })).to.be.eventually.rejectedWith(BadRequestError, /vous devez vider votre stock de sujets pour effectuer cette action/i);
  });

  it('should succeed if the status is running and the remaining chickens count is 0', async function () {
    const band = await BandFactory.createBand({ status: BAND_STATUSES.RUNNING, chickensStartCount: 100, chickensDeathsCount: 0, chickensSalesCount: 100 });

    const updatedBand = await expect(endBandUseCase.execute({ bandId: band.id })).to.be.fulfilled;
    expect(updatedBand.status).to.eql(BAND_STATUSES.ENDED);
    expect(dateUtils.isEqual({ date: updatedBand.endedAt })).to.eql(true);
  });
});
