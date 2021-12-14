const { BAND_STATUSES } = require('../../database/enums');
const { Sale, Expense } = require('../../database/models');
const { findBandById } = require('./helpers/band.helper');

module.exports = function getBandAnalytics() {
  async function execute({ bandId } = {}) {
    const band = await findBandById(bandId);
    const dates = await getDatesAnalytics(band);
    const counts = getCountsAnalytics(band);
    const ages = getAgesAnalytics(band);
    const amounts = await getAmountsAnalytics(band);

    return { dates, counts, ages, amounts };
  }

  async function getDatesAnalytics(band) {
    const { createdAt, startedAt, broodingEndedAt, status } = band;
    const dates = { createdAt, startedAt, broodingEndedAt };
    const sales = await Sale.find({ band });
    if (sales.length > 0) {
      dates.salesStartedAt = sales[0].date;
      if ([BAND_STATUSES.ENDED, BAND_STATUSES.CANCELLED].includes(status)) {
        dates.salesEndedAt = sales[sales.length - 1].date;
      }
    }

    return dates;
  }

  function getCountsAnalytics(band) {
    const { chickensStartCount, chickensDeathsCount, chickensDeathRate } = band;

    return { total: chickensStartCount, deaths: chickensDeathsCount, deathRate: chickensDeathRate };
  }

  function getAgesAnalytics(band) {
    const { chickensStartAge, chickensCurrentAge } = band;

    return { start: chickensStartAge, current: chickensCurrentAge };
  }

  async function getAmountsAnalytics(band) {
    const [{ totalExpenses = 0 } = {}] = await Expense.aggregate([{ $match: { band: band._id } }, { $group: { _id: null, totalExpenses: { $sum: '$totalPrice' } } }]);
    const [{ totalSales = 0 } = {}] = await Sale.aggregate([{ $match: { band: band._id } }, { $group: { _id: null, totalSales: { $sum: '$totalPrice' } } }]);

    return { totalExpenses, totalSales, turnover: totalSales - totalExpenses };
  }

  return { execute };
};
