const { CHICKENS_MATURITY_AGE } = require('../../../application/helpers/constants');
const { ResourceNotFoundError } = require('../../../application/helpers/errors');
const { isNullish, isValidValue } = require('../../../application/helpers/types.helper');
const { DAY_TAGS } = require('../../../database/enums');
const { Day, Band } = require('../../../database/models');
const { dateUtils } = require('../../../infrastructure');

async function initializeDays(band) {
  if (isNullish(band.startedAt)) return;

  const days = [];
  const daysLeftBeforeMaturity = getDaysLeftBeforeMaturity(band);
  const additionalDaysAfterMaturity = getAdditionalDaysAfterMaturity(band);
  days.push(...generateDays(band, daysLeftBeforeMaturity));
  days.push(...generateDays(band, additionalDaysAfterMaturity));

  return saveDays(days);
}

function getDaysLeftBeforeMaturity({ chickensStartAge }) {
  const days = [];
  let ageCounter = chickensStartAge;
  while (ageCounter <= CHICKENS_MATURITY_AGE) {
    days.push(ageCounter);
    ageCounter++;
  }

  return days;
}

function getAdditionalDaysAfterMaturity({ chickensCurrentAge }) {
  if (chickensCurrentAge <= CHICKENS_MATURITY_AGE) return [];

  const days = [];
  let ageCounter = CHICKENS_MATURITY_AGE + 1;
  while (ageCounter <= chickensCurrentAge) {
    days.push(ageCounter);
    ageCounter++;
  }

  return days;
}

function generateDays(band, daysLeftBeforeMaturity = []) {
  const { startedAt, chickensStartCount, prophylaxis } = band;

  return daysLeftBeforeMaturity.map((age, index) => {
    const day = new Day({ date: dateUtils.add({ date: startedAt, amount: index }), chickensCount: chickensStartCount, chickensAge: age, band });
    setDayVaccinationTag(day, prophylaxis);

    return day;
  });
}

function setDayVaccinationTag(day, prophylaxis) {
  if (isNullish(prophylaxis) || isNullish(prophylaxis.records)) return;

  const prophylaxisRecord = prophylaxis.records.find((record) => record.chickensAge === day.chickensAge);
  if (isValidValue(prophylaxisRecord)) {
    day.prophylaxisRecord = prophylaxisRecord;
    day.tags.push(DAY_TAGS.VACCINE);
  }
}

async function saveDays(days = []) {
  return Promise.all(days.map((day) => day.save()));
}

async function findBandById(bandId) {
  const band = await Band.findById(bandId);
  if (!band) throw new ResourceNotFoundError(`No band found for id: ${bandId}`);

  return band;
}

module.exports = { initializeDays, findBandById };
