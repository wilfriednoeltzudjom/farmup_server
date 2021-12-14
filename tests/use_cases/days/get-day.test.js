const { expect } = require('chai');

const dependencies = require('../../../src/infrastructure');
const getDayUseCase = require('../../../src/use_cases/days/get-day.usecase')(dependencies);
const { DayFactory } = require('../../../src/database/factories');
const { ResourceNotFoundError } = require('../../../src/application/helpers/errors');

describe('UseCase - Days - Get day', () => {
  it('should fail if there is no day related to the provided id', async function () {
    await expect(getDayUseCase.execute()).to.be.eventually.rejectedWith(ResourceNotFoundError);
  });

  it('should succeed and return the day related to the provided id', async function () {
    const day = await DayFactory.createDay();

    const response = await expect(getDayUseCase.execute({ dayId: day.id })).to.be.fulfilled;
    expect(response.id).to.eql(day.id);
  });
});
