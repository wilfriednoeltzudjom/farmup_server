const { BAND_STATUSES } = require('../../database/enums');
const { Band } = require('../../database/models');
const { findFarmById } = require('../farms/helpers/farm.helper');

module.exports = function buildGetBandsAnalytics() {
  async function execute({ farmId } = {}) {
    const farm = await findFarmById(farmId);
    const bandsCounts = await Band.aggregate([{ $match: { farm: farm._id } }, { $group: { _id: '$status', count: { $sum: 1 } } }]);

    return formatAnalytics(bandsCounts);
  }

  function formatAnalytics(bandsCounts = []) {
    const pendingCount = extractBandsCountByStatus(bandsCounts, BAND_STATUSES.PENDING);
    const runningCount = extractBandsCountByStatus(bandsCounts, BAND_STATUSES.RUNNING);
    const cancelledCount = extractBandsCountByStatus(bandsCounts, BAND_STATUSES.CANCELLED);
    const endedCount = extractBandsCountByStatus(bandsCounts, BAND_STATUSES.ENDED);

    return { counts: { pending: pendingCount, running: runningCount, cancelled: cancelledCount, ended: endedCount, total: pendingCount + runningCount + cancelledCount + endedCount } };
  }

  function extractBandsCountByStatus(bandsCounts, status) {
    const bandsCount = bandsCounts.find(({ _id }) => _id === status);

    return bandsCount ? bandsCount.count : 0;
  }

  return { execute };
};
