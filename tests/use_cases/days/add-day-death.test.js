const { expect } = require('chai');

const dependencies = require('../../../src/infrastructure');
const addDayDeathUseCase = require('../../../src/use_cases/days/add-day-death.usecase')(dependencies);
const { BandFactory, DayFactory, DayDeathFactory } = require('../../../src/database/factories');
const { ResourceNotFoundError, BadRequestError } = require('../../../src/application/helpers/errors');

describe('UseCase - Days - Add day death', () => {
  const { dateUtils } = dependencies;

  beforeEach(function () {
    this.bandData = { chickensDeathsCount: 0, chickensSalesCount: 21, chickensStartCount: 150 };
    this.dayData = { chickensCount: 100 };
    this.dayDeathData = DayDeathFactory.generateDayDeath({ date: dateUtils.now(), count: 2 });
  });

  it('should fail if there is no day related to the provided id', async function () {
    await expect(addDayDeathUseCase.execute(this.dayDeathData)).to.be.eventually.rejectedWith(ResourceNotFoundError);
  });

  it('should fail if the provided date is different from the day date', async function () {
    const band = await BandFactory.createBand(this.bandData);
    const day = await DayFactory.createDay({ date: dateUtils.substract({ amount: 1 }), band, ...this.dayData }, { deaths: { skip: true } });

    await expect(addDayDeathUseCase.execute({ dayId: day.id, ...this.dayDeathData })).to.be.eventually.rejectedWith(BadRequestError);
  });

  it('should fail if the remaining chickens count is less than the provided count', async function () {
    const date = dateUtils.now();
    const band = await BandFactory.createBand(this.bandData);
    const day = await DayFactory.createDay({ date, band }, { deaths: { skip: true } });
    const deathData = { date, count: 130 };

    await expect(addDayDeathUseCase.execute({ dayId: day.id, ...deathData })).to.be.eventually.rejectedWith(BadRequestError, /nombre de pertes incorrect/i);
  });

  it('should succeed and properly save a death entry', async function () {
    const band = await BandFactory.createBand(this.bandData);
    const [pastDay, day, futureDay] = await Promise.all(
      [dateUtils.substract({ amount: 1 }), dateUtils.now(), dateUtils.add({ amount: 1 })].map((date) => {
        return DayFactory.createDay({ date, band, ...this.dayData }, { deaths: { skip: true } });
      })
    );

    const updatedDay = await expect(addDayDeathUseCase.execute({ dayId: day.id, ...this.dayDeathData })).to.be.fulfilled;
    expect(updatedDay.deaths).to.have.lengthOf(1);
    expect(updatedDay.deaths[0]).to.deep.includes(this.dayDeathData);
    expect(updatedDay.chickensCount).to.eql(98);

    const updatedPastDay = await pastDay.refresh();
    const updatedFutureDay = await futureDay.refresh();
    const updatedBand = await band.refresh();

    expect(updatedPastDay.chickensCount).to.eql(100);
    expect(updatedFutureDay.chickensCount).to.eql(98);
    expect(updatedBand.chickensDeathsCount).to.eql(2);
  });
});
