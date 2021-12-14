const { expect } = require('chai');

const dependencies = require('../../../src/infrastructure');
const deleteBandUseCase = require('../../../src/use_cases/bands/delete-band.usecase')(dependencies);
const { BandFactory } = require('../../../src/database/factories');
const { ResourceNotFoundError, BadRequestError } = require('../../../src/application/helpers/errors');
const { BAND_STATUSES } = require('../../../src/database/enums');

describe('UseCase - Bands - Delete band', () => {
  const { dataUtils } = dependencies;

  it('should fail if there is no band related to the provided id', async function () {
    await expect(deleteBandUseCase.execute()).to.be.eventually.rejectedWith(ResourceNotFoundError);
  });

  it('should fail if the band is not in pending status', async function () {
    const status = dataUtils.getRandomArrayValue([BAND_STATUSES.RUNNING, BAND_STATUSES.CANCELLED, BAND_STATUSES.ENDED]);
    const band = await BandFactory.createBand({ status });

    expect(deleteBandUseCase.execute({ bandId: band.id })).to.be.eventually.rejectedWith(BadRequestError, `You can only delete a pending band. Your band status is ${band.status}`);
  });

  it('should succeed and delete an existing band', async function () {
    const band = await BandFactory.createBand({ status: BAND_STATUSES.PENDING });

    await expect(deleteBandUseCase.execute({ bandId: band.id })).to.be.fulfilled;
  });
});
