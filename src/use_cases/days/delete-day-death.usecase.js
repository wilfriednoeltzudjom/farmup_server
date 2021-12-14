const { findBandById } = require('../bands/helpers/band.helper');
const { findDayById, getDaysAfterDay } = require('./helpers/day.helper');

module.exports = function buildDeleteDayDeath() {
  async function execute({ dayId, deathId } = {}) {
    const day = await findDayById(dayId);
    const death = findDeath(day, deathId);
    await applyDayUpdates(day, death);
    await updateDaysAfterChickensCount(day, death);
    await updateBandChickensDeathsCount(day, death);

    return day.save();
  }

  function findDeath(day, deathId) {
    return day.deaths.find((death) => death.id === deathId);
  }

  async function applyDayUpdates(day, death) {
    day.deaths = day.deaths.filter(({ id }) => id !== death.id);
    day.chickensCount = day.chickensCount + death.count;

    return day.save();
  }

  async function updateDaysAfterChickensCount(day, death) {
    const daysAfter = await getDaysAfterDay(day);

    return Promise.all(
      daysAfter.map((dayAfter) => {
        dayAfter.chickensCount = dayAfter.chickensCount + death.count;

        return dayAfter.save();
      })
    );
  }

  async function updateBandChickensDeathsCount(day, death) {
    const band = await findBandById(day.band);
    band.chickensDeathsCount = band.chickensDeathsCount - death.count;

    return band.save();
  }

  return { execute };
};
