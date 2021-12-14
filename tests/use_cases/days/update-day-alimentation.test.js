const { expect } = require('chai');

const dependencies = require('../../../src/infrastructure');
const updateDayAlimentationUseCase = require('../../../src/use_cases/days/update-day-alimentation.usecase')(dependencies);
const { DayFactory, DayAlimentationFactory } = require('../../../src/database/factories');
const { ResourceNotFoundError, BadRequestError } = require('../../../src/application/helpers/errors');

describe('UseCase - Days - Update day alimentation', () => {
  const { dateUtils } = dependencies;

  beforeEach(function () {
    this.dayAlimentationData = DayAlimentationFactory.generateDayAlimentation({ date: dateUtils.now() });
  });

  it('should fail if there is no day related to the provided id', async function () {
    await expect(updateDayAlimentationUseCase.execute(this.dayAlimentationData)).to.be.eventually.rejectedWith(ResourceNotFoundError);
  });

  it('should fail if the provided date is different from the day date', async function () {
    const day = await DayFactory.createDay({ date: dateUtils.substract({ amount: 1 }) }, { alimentations: { skip: true } });

    await expect(updateDayAlimentationUseCase.execute({ dayId: day.id, ...this.dayAlimentationData })).to.be.eventually.rejectedWith(BadRequestError);
  });

  it('should succeed and properly update an alimentation entry', async function () {
    const alimentationData = DayAlimentationFactory.generateDayAlimentation({});
    const day = await DayFactory.createDay({ date: dateUtils.now(), alimentations: [alimentationData] });

    const updatedDay = await expect(updateDayAlimentationUseCase.execute({ dayId: day.id, alimentationId: day.alimentations[0].id, ...this.dayAlimentationData })).to.be.fulfilled;
    expect(updatedDay.alimentations[0]).to.deep.includes(this.dayAlimentationData);
  });
});
