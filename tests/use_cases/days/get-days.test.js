const { expect } = require('chai');

const dependencies = require('../../../src/infrastructure');
const getDaysUseCase = require('../../../src/use_cases/days/get-days.usecase')(dependencies);
const { BandFactory, DayFactory } = require('../../../src/database/factories');
const { ResourceNotFoundError } = require('../../../src/application/helpers/errors');

describe('UseCase - Days - Get days', () => {
  it('should fail if there is no band related to the provided id', async function () {
    await expect(getDaysUseCase.execute()).to.be.eventually.rejectedWith(ResourceNotFoundError);
  });

  it('should succeed and return all days', async function () {
    const count = 5;
    const band = await BandFactory.createBand();
    await Promise.all(
      Array(count)
        .fill()
        .map((_, index) => {
          const dayData = {};
          if (index > 0) dayData.band = band;

          return DayFactory.createDay(dayData);
        })
    );

    const days = await expect(getDaysUseCase.execute({ bandId: band.id })).to.be.fulfilled;
    expect(days).to.have.lengthOf(count - 1);
  });
});
