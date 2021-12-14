const { expect } = require('chai');

const dependencies = require('../../../src/infrastructure');
const deleteDayDeathUseCase = require('../../../src/use_cases/days/delete-day-death.usecase')(dependencies);
const { BandFactory, DayFactory, DayDeathFactory } = require('../../../src/database/factories');
const { ResourceNotFoundError } = require('../../../src/application/helpers/errors');

describe('UseCase - Days - Delete day death', () => {
  const { dateUtils } = dependencies;

  it('should fail if there is no day related to the provided id', async function () {
    await expect(deleteDayDeathUseCase.execute()).to.be.eventually.rejectedWith(ResourceNotFoundError);
  });

  it('should succeed and properly delete a death entry', async function () {
    const band = await BandFactory.createBand({ chickensDeathsCount: 2 });
    const [pastDay, day, futureDay] = await Promise.all(
      [
        { deathData: DayDeathFactory.generateDayDeath(), dayData: { date: dateUtils.substract({ amount: 1 }), chickensCount: 100 } },
        { deathData: DayDeathFactory.generateDayDeath({ count: 2 }), dayData: { date: dateUtils.now(), chickensCount: 98 } },
        { deathData: DayDeathFactory.generateDayDeath(), dayData: { date: dateUtils.add({ amount: 1 }), chickensCount: 98 } },
      ].map(({ deathData, dayData }) => {
        return DayFactory.createDay({ deaths: [deathData], band, ...dayData });
      })
    );

    const updatedDay = await expect(deleteDayDeathUseCase.execute({ dayId: day.id, deathId: day.deaths[0].id })).to.be.fulfilled;
    expect(updatedDay.deaths).to.be.empty;
    expect(updatedDay.chickensCount).to.eql(100);

    const updatedPastDay = await pastDay.refresh();
    const updatedFutureDay = await futureDay.refresh();
    const updatedBandDay = await band.refresh();

    expect(updatedPastDay.chickensCount).to.eql(100);
    expect(updatedFutureDay.chickensCount).to.eql(100);
    expect(updatedBandDay.chickensDeathsCount).to.eql(0);
  });
});
