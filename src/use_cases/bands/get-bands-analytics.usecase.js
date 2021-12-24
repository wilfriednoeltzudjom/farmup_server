const { BAND_STATUSES } = require('../../database/enums');
const { Band } = require('../../database/models');
const { findFarmById } = require('../farms/helpers/farm.helper');
const { getBandAmountsAnalytics } = require('./helpers/band.helper');

module.exports = function buildGetBandsAnalytics() {
  async function execute({ farmId, countsOnly = false } = {}) {
    const farm = await findFarmById(farmId);
    const counts = await getCountsAnalytics(farm);
    if (countsOnly) return { counts };

    const amounts = await getAmountsAnalytics(farm);

    return { counts, amounts };
  }

  async function getCountsAnalytics(farm) {
    const bandsCounts = await Band.aggregate([{ $match: { farm: farm._id } }, { $group: { _id: '$status', count: { $sum: 1 } } }]);
    const pendingCount = extractBandsCountByStatus(bandsCounts, BAND_STATUSES.PENDING);
    const runningCount = extractBandsCountByStatus(bandsCounts, BAND_STATUSES.RUNNING);
    const cancelledCount = extractBandsCountByStatus(bandsCounts, BAND_STATUSES.CANCELLED);
    const endedCount = extractBandsCountByStatus(bandsCounts, BAND_STATUSES.ENDED);

    return { pending: pendingCount, running: runningCount, cancelled: cancelledCount, ended: endedCount, total: pendingCount + runningCount + cancelledCount + endedCount };
  }

  function extractBandsCountByStatus(bandsCounts, status) {
    const bandsCount = bandsCounts.find(({ _id }) => _id === status);

    return bandsCount ? bandsCount.count : 0;
  }

  async function getAmountsAnalytics(farm) {
    const bands = await getValidBands(farm);
    const bandsAnalytics = await getBandsAnalytics(bands);

    return bandsAnalytics.reduce(
      (accumulator, { totalExpenses, totalSales, turnover }) => {
        return {
          totalExpenses: accumulator.totalExpenses + totalExpenses,
          totalSales: accumulator.totalSales + totalSales,
          turnover: accumulator.turnover + turnover,
        };
      },
      { totalExpenses: 0, totalSales: 0, turnover: 0 }
    );
  }

  async function getValidBands(farm) {
    return Band.find({ farm, status: { $in: [BAND_STATUSES.RUNNING, BAND_STATUSES.ENDED] } });
  }

  async function getBandsAnalytics(bands) {
    return Promise.all(bands.map(getBandAmountsAnalytics));
  }

  return { execute };
};
