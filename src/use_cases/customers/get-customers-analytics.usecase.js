const { CUSTOMER_TYPES } = require('../../database/enums');
const { Customer } = require('../../database/models');
const { findFarmById } = require('../farms/helpers/farm.helper');

module.exports = function buildCustomersAnalyticsUseCase() {
  async function execute({ farmId } = {}) {
    const farm = await findFarmById(farmId);
    const customersCounts = await Customer.aggregate([{ $match: { farm: farm._id } }, { $group: { _id: '$type', count: { $sum: 1 } } }]);
    const counts = formatCustomersAnalytics(customersCounts);

    return { counts };
  }

  function formatCustomersAnalytics(customersCounts) {
    const companies = extractCustomersCountByType(customersCounts, CUSTOMER_TYPES.COMPANY);
    const individuals = extractCustomersCountByType(customersCounts, CUSTOMER_TYPES.INDIVIDUAL);

    return { companies, individuals, total: companies + individuals };
  }

  function extractCustomersCountByType(customersCounts, type) {
    const customersCount = customersCounts.find(({ _id }) => _id === type);

    return customersCount ? customersCount.count : 0;
  }

  return { execute };
};
