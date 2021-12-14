const { expect } = require('chai');

const dependencies = require('../../../src/infrastructure');
const getBandsUseCase = require('../../../src/use_cases/bands/get-bands.usecase')(dependencies);
const { FarmFactory, BandFactory } = require('../../../src/database/factories');
const { ResourceNotFoundError } = require('../../../src/application/helpers/errors');

describe('UseCase - Bands - Get bands', () => {
  it('should fail if there is no farm related to the provided id', async function () {
    await expect(getBandsUseCase.execute()).to.be.eventually.rejectedWith(ResourceNotFoundError);
  });

  it('should succeed and return all bands', async function () {
    const count = 5;
    const farm = await FarmFactory.createFarm();
    await Promise.all(
      Array(count)
        .fill()
        .map((_, index) => {
          const bandData = {};
          if (index > 0) bandData.farm = farm;

          return BandFactory.createBand(bandData);
        })
    );

    const bands = await expect(getBandsUseCase.execute({ farmId: farm.id })).to.be.fulfilled;
    expect(bands).to.have.lengthOf(count - 1);
  });

  it('should succeed and return all bands within limit', async function () {
    const count = 5;
    const limit = 3;
    const farm = await FarmFactory.createFarm();
    await Promise.all(
      Array(count)
        .fill()
        .map(() => BandFactory.createBand({ farm }))
    );

    const bands = await expect(getBandsUseCase.execute({ farmId: farm.id, limit })).to.be.fulfilled;
    expect(bands).to.have.lengthOf(limit);
  });
});
