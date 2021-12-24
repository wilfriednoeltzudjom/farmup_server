const { BAND_STATUSES } = require('../database/enums');
const { Band, Day } = require('../database/models');
const dateUtils = require('../infrastructure/date_utils');
const logger = require('../infrastructure/logger');

module.exports = function buildIncreaseBandsChickensAges() {
  async function execute() {
    logger.info('Cron job <increase chickens age> has started.');

    const bands = await findUpdatableBands();

    return Promise.all(bands.map(increaseBandCurrentAge));
  }

  async function findUpdatableBands() {
    return Band.find({ status: BAND_STATUSES.RUNNING }).populate('farm');
  }

  async function increaseBandCurrentAge(band) {
    const { chickensStartAge, chickensCurrentAge, startedAt } = band;
    const updatedChickensCurrentAge = dateUtils.diff({ dateBefore: startedAt }) + chickensStartAge;
    if (updatedChickensCurrentAge === chickensCurrentAge) return;

    await applyBandUpdates(band, { chickensCurrentAge: updatedChickensCurrentAge });
    await createAdditionalDaysIfTheyDontExist(band);

    logger.info(`Cron job <increase chickens age> done. <${chickensCurrentAge} -> ${band.chickensCurrentAge}> for band: ${band.id} - farm: ${band.farm.id}`);
  }

  async function applyBandUpdates(band, updates = {}) {
    Object.assign(band, updates);
    await band.save();
  }

  async function createAdditionalDaysIfTheyDontExist(band) {
    const lastDay = await getBandLastDay(band);
    if (!lastDay || lastDay.chickensAge >= band.chickensCurrentAge) return;

    const additionalDays = [];
    let ageCounter = lastDay.chickensAge + 1;
    while (ageCounter <= band.chickensCurrentAge) {
      additionalDays.push(ageCounter);
      ageCounter++;
    }

    return Promise.all(
      additionalDays.map((age, index) => {
        const day = new Day({
          date: dateUtils.add({ date: lastDay.date, amount: index + 1 }),
          chickensAge: age,
          chickensCount: lastDay.chickensCount,
          band,
          farm: band.farm,
        });

        return day.save();
      })
    );
  }

  async function getBandLastDay(band) {
    const days = await Day.find({ band }).sort({ chickensAge: -1 }).limit(1);

    return days[0];
  }

  return { execute };
};
