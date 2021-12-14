const { expect } = require('chai');

const dependencies = require('../../../src/infrastructure');
const updateBandUseCase = require('../../../src/use_cases/bands/update-band.usecase')(dependencies);
const { BandFactory } = require('../../../src/database/factories');
const { ResourceNotFoundError } = require('../../../src/application/helpers/errors');
const { isValidValue } = require('../../../src/application/helpers/types.helper');

describe('UseCase - Bands - Update band', () => {
  it('should fail if there is no band related to the provided id', async function () {
    await expect(updateBandUseCase.execute()).to.be.eventually.rejectedWith(ResourceNotFoundError);
  });

  it('should succeed and apply update on an existing band', async function () {
    const band = await BandFactory.createBand();

    const updatedBand = await expect(updateBandUseCase.execute({ bandId: band.id, broodingEndedAt: new Date() })).to.be.fulfilled;
    expect(isValidValue(updatedBand.broodingEndedAt)).to.eql(true);
  });
});
