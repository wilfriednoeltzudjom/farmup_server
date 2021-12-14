const { findBandById } = require('../bands/helpers/band.helper');
const { findDayById, ensureObjectDateIsSameAsDay, getDaysAfterDay } = require('./helpers/day.helper');

module.exports = function buildAddDayDeath(dependencies) {
  const { dataValidator } = dependencies;

  async function execute({ dayId, ...data } = {}) {
    validateData(data);

    const day = await findDayById(dayId);
    ensureObjectDateIsSameAsDay(data, day);
    day.deaths.push(data);
    await applyDayUpdates(day, data);
    await updateDaysAfterChickensCount(day, data);
    await updateBandChickensDeathsCount(day, data);

    return day;
  }

  function validateData({ count, date, comment }) {
    dataValidator.validateNumberAsRequired(count, 'Death count');
    dataValidator.validateDateAsRequired(date, 'Death date');
    dataValidator.validateString(comment, 'Death comment');
  }

  async function applyDayUpdates(day, { count }) {
    day.chickensCount = day.chickensCount - count;

    return day.save();
  }

  async function updateDaysAfterChickensCount(day, { count }) {
    const daysAfter = await getDaysAfterDay(day);

    return Promise.all(
      daysAfter.map((dayAfter) => {
        dayAfter.chickensCount = dayAfter.chickensCount - count;

        return dayAfter.save();
      })
    );
  }

  async function updateBandChickensDeathsCount(day, { count }) {
    const band = await findBandById(day.band);
    band.chickensDeathsCount = band.chickensDeathsCount + count;

    return band.save();
  }

  return { execute };
};
