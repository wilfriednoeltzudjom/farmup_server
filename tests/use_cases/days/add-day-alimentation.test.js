const { expect } = require('chai');

const dependencies = require('../../../src/infrastructure');
const addDayAlimentationUseCase = require('../../../src/use_cases/days/add-day-alimentation.usecase')(dependencies);
const { DayFactory, DayAlimentationFactory } = require('../../../src/database/factories');
const { ResourceNotFoundError, BadRequestError } = require('../../../src/application/helpers/errors');

describe('UseCase - Days - Add day alimentation', () => {
  const { dateUtils } = dependencies;

  beforeEach(function () {
    this.dayAlimentationData = DayAlimentationFactory.generateDayAlimentation({ date: dateUtils.now() });
  });

  it('should fail if there is no day related to the provided id', async function () {
    await expect(addDayAlimentationUseCase.execute(this.dayAlimentationData)).to.be.eventually.rejectedWith(ResourceNotFoundError);
  });

  it('should fail if the provided date is different from the day date', async function () {
    const day = await DayFactory.createDay({ date: dateUtils.substract({ amount: 1 }) }, { alimentations: { skip: true } });

    await expect(addDayAlimentationUseCase.execute({ dayId: day.id, ...this.dayAlimentationData })).to.be.eventually.rejectedWith(BadRequestError);
  });

  it('should succeed and properly save an alimentation entry', async function () {
    const day = await DayFactory.createDay({ date: dateUtils.now() }, { alimentations: { skip: true } });

    const updatedDay = await expect(addDayAlimentationUseCase.execute({ dayId: day.id, ...this.dayAlimentationData })).to.be.fulfilled;
    expect(updatedDay.alimentations).to.have.lengthOf(1);
    expect(updatedDay.alimentations[0]).to.deep.includes(this.dayAlimentationData);
  });
});
