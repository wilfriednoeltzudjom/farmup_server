const { CHICKENS_MATURITY_AGE } = require('../../../application/helpers/constants');
const { ResourceNotFoundError } = require('../../../application/helpers/errors');
const { isNullish, isValidValue } = require('../../../application/helpers/types.helper');
const { DAY_TAGS, BAND_STATUSES } = require('../../../database/enums');
const { Day, Band, Expense, Sale } = require('../../../database/models');
const { dateUtils } = require('../../../infrastructure');

async function initializeDays(band) {
  if (isNullish(band.startedAt)) return;

  const days = [];
  const daysLeftBeforeMaturity = getDaysLeftBeforeMaturity(band);
  const additionalDaysAfterMaturity = getAdditionalDaysAfterMaturity(band);
  days.push(...generateDays(band, [...daysLeftBeforeMaturity, ...additionalDaysAfterMaturity]));

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
    const day = new Day({ date: dateUtils.add({ date: startedAt, amount: index }), chickensCount: chickensStartCount, chickensAge: age, band, farm: band.farm });
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

function areBandSubDocumentsNonEditable(band) {
  return [BAND_STATUSES.PENDING, BAND_STATUSES.CANCELLED, BAND_STATUSES.ENDED].includes(band.status);
}

async function getBandAmountsAnalytics(band) {
  const [{ totalExpenses = 0 } = {}] = await Expense.aggregate([{ $match: { band: band._id } }, { $group: { _id: null, totalExpenses: { $sum: '$totalPrice' } } }]);
  const [{ totalSales = 0 } = {}] = await Sale.aggregate([{ $match: { band: band._id } }, { $group: { _id: null, totalSales: { $sum: '$totalPrice' } } }]);

  return { totalExpenses, totalSales, turnover: totalSales - totalExpenses };
}

module.exports = { initializeDays, findBandById, areBandSubDocumentsNonEditable, getBandAmountsAnalytics };
