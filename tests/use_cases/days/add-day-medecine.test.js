const { expect } = require('chai');

const dependencies = require('../../../src/infrastructure');
const addDayMedecineUseCase = require('../../../src/use_cases/days/add-day-medecine.usecase')(dependencies);
const { DayFactory, DayMedecineFactory } = require('../../../src/database/factories');
const { ResourceNotFoundError, BadRequestError } = require('../../../src/application/helpers/errors');

describe('UseCase - Days - Add day medecine', () => {
  const { dateUtils } = dependencies;

  beforeEach(function () {
    this.dayMedecineData = DayMedecineFactory.generateDayMedecine({ date: dateUtils.now() });
  });

  it('should fail if there is no day related to the provided id', async function () {
    await expect(addDayMedecineUseCase.execute(this.dayMedecineData)).to.be.eventually.rejectedWith(ResourceNotFoundError);
  });

  it('should fail if the provided date is different from the day date', async function () {
    const day = await DayFactory.createDay({ date: dateUtils.substract({ amount: 1 }) }, { medecines: { skip: true } });

    await expect(addDayMedecineUseCase.execute({ dayId: day.id, ...this.dayMedecineData })).to.be.eventually.rejectedWith(BadRequestError);
  });

  it('should succeed and properly save a medecine entry', async function () {
    const day = await DayFactory.createDay({ date: dateUtils.now() }, { medecines: { skip: true } });

    const updatedDay = await expect(addDayMedecineUseCase.execute({ dayId: day.id, ...this.dayMedecineData })).to.be.fulfilled;
    expect(updatedDay.medecines).to.have.lengthOf(1);
    expect(updatedDay.medecines[0]).to.deep.includes(this.dayMedecineData);
  });
});
