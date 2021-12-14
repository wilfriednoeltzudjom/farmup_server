const { expect } = require('chai');

const dependencies = require('../../../src/infrastructure');
const deleteDayMedecineUseCase = require('../../../src/use_cases/days/delete-day-medecine.usecase')(dependencies);
const { DayFactory, DayMedecineFactory } = require('../../../src/database/factories');
const { ResourceNotFoundError } = require('../../../src/application/helpers/errors');

describe('UseCase - Days - Delete day medecine', () => {
  it('should fail if there is no day related to the provided id', async function () {
    await expect(deleteDayMedecineUseCase.execute()).to.be.eventually.rejectedWith(ResourceNotFoundError);
  });

  it('should succeed and properly delete an medecine entry', async function () {
    const medecineData = DayMedecineFactory.generateDayMedecine({});
    const day = await DayFactory.createDay({ medecines: [medecineData] });

    const updatedDay = await expect(deleteDayMedecineUseCase.execute({ dayId: day.id, medecineId: day.medecines[0].id })).to.be.fulfilled;
    expect(updatedDay.medecines).to.be.empty;
  });
});
