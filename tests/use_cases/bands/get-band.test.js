const { expect } = require('chai');

const dependencies = require('../../../src/infrastructure');
const getBandUseCase = require('../../../src/use_cases/bands/get-band.usecase')(dependencies);
const { BandFactory } = require('../../../src/database/factories');
const { ResourceNotFoundError } = require('../../../src/application/helpers/errors');

describe('UseCase - Bands - Get band', () => {
  it('should fail if there is no band related to the provided id', async function () {
    await expect(getBandUseCase.execute()).to.be.eventually.rejectedWith(ResourceNotFoundError);
  });

  it('should succeed and return an existing band', async function () {
    const band = await BandFactory.createBand();

    const foundBand = await expect(getBandUseCase.execute({ bandId: band.id })).to.be.fulfilled;
    expect(foundBand.id).to.eql(band.id);
  });
});
