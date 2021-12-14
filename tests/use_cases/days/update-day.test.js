const { expect } = require('chai');

const dependencies = require('../../../src/infrastructure');
const updateDayUseCase = require('../../../src/use_cases/days/update-day.usecase')(dependencies);
const { DayFactory } = require('../../../src/database/factories');
const { ResourceNotFoundError } = require('../../../src/application/helpers/errors');

describe('UseCase - Days - Update day', () => {
  it('should fail if there is no day related to the provided id', async function () {
    await expect(updateDayUseCase.execute()).to.be.eventually.rejectedWith(ResourceNotFoundError);
  });

  it('should succeed and properly update day data', async function () {
    const day = await DayFactory.createDay();
    const { chickensMinimumWeight, chickensMaximumWeight, buildingTemperature } = DayFactory.generateDay({ chickensMinimumWeight: 1.5, chickensMaximumWeight: 2.5 });

    const updatedDay = await expect(updateDayUseCase.execute({ dayId: day.id, chickensMinimumWeight, chickensMaximumWeight, buildingTemperature })).to.be.fulfilled;
    expect(updatedDay.chickensMinimumWeight).to.eql(chickensMinimumWeight);
    expect(updatedDay.chickensMaximumWeight).to.eql(chickensMaximumWeight);
    expect(updatedDay.chickensWeight).to.eql(2);
    expect(updatedDay.buildingTemperature).to.eql(buildingTemperature);
  });
});
