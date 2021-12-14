const { expect } = require('chai');

const dependencies = require('../../../src/infrastructure');
const updateDayMedecineUseCase = require('../../../src/use_cases/days/update-day-medecine.usecase')(dependencies);
const { DayFactory, DayMedecineFactory } = require('../../../src/database/factories');
const { ResourceNotFoundError, BadRequestError } = require('../../../src/application/helpers/errors');

describe('UseCase - Days - Update day medecine', () => {
  const { dateUtils } = dependencies;

  beforeEach(function () {
    this.dayMedecineData = DayMedecineFactory.generateDayMedecine({ date: dateUtils.now() });
  });

  it('should fail if there is no day related to the provided id', async function () {
    await expect(updateDayMedecineUseCase.execute(this.dayMedecineData)).to.be.eventually.rejectedWith(ResourceNotFoundError);
  });

  it('should fail if the provided date is different from the day date', async function () {
    const day = await DayFactory.createDay({ date: dateUtils.substract({ amount: 1 }) }, { medecines: { skip: true } });

    await expect(updateDayMedecineUseCase.execute({ dayId: day.id, ...this.dayMedecineData })).to.be.eventually.rejectedWith(BadRequestError);
  });

  it('should fail when trying to remove medecine category', async function () {
    const medecineData = DayMedecineFactory.generateDayMedecine({});
    const day = await DayFactory.createDay({ date: dateUtils.now(), medecines: [medecineData] });
    this.dayMedecineData.category = '';

    await expect(updateDayMedecineUseCase.execute({ dayId: day.id, medecineId: day.medecines[0].id, ...this.dayMedecineData })).to.be.eventually.rejectedWith(BadRequestError);
  });

  it('should succeed and properly update a medecine entry', async function () {
    const medecineData = DayMedecineFactory.generateDayMedecine({});
    const day = await DayFactory.createDay({ date: dateUtils.now(), medecines: [medecineData] });

    const updatedDay = await expect(updateDayMedecineUseCase.execute({ dayId: day.id, medecineId: day.medecines[0].id, ...this.dayMedecineData })).to.be.fulfilled;
    expect(updatedDay.medecines[0]).to.deep.includes(this.dayMedecineData);
  });
});
