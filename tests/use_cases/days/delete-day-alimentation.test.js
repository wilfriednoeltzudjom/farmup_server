const { expect } = require('chai');

const dependencies = require('../../../src/infrastructure');
const deleteDayAlimentationUseCase = require('../../../src/use_cases/days/delete-day-alimentation.usecase')(dependencies);
const { DayFactory, DayAlimentationFactory } = require('../../../src/database/factories');
const { ResourceNotFoundError } = require('../../../src/application/helpers/errors');

describe('UseCase - Days - Delete day alimentation', () => {
  it('should fail if there is no day related to the provided id', async function () {
    await expect(deleteDayAlimentationUseCase.execute()).to.be.eventually.rejectedWith(ResourceNotFoundError);
  });

  it('should succeed and properly delete an alimentation entry', async function () {
    const alimentationData = DayAlimentationFactory.generateDayAlimentation({});
    const day = await DayFactory.createDay({ alimentations: [alimentationData] });

    const updatedDay = await expect(deleteDayAlimentationUseCase.execute({ dayId: day.id, alimentationId: day.alimentations[0].id })).to.be.fulfilled;
    expect(updatedDay.alimentations).to.be.empty;
  });
});
