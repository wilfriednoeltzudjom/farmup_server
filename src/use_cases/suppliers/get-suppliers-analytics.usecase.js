const { SUPPLIER_TYPES } = require('../../database/enums');
const { Supplier } = require('../../database/models');
const { findFarmById } = require('../farms/helpers/farm.helper');

module.exports = function buildSuppliersAnalytics() {
  async function execute({ farmId } = {}) {
    const farm = await findFarmById(farmId);
    const suppliersCounts = await Supplier.aggregate([{ $match: { farm: farm._id } }, { $group: { _id: '$type', count: { $sum: 1 } } }]);
    const counts = formatSuppliersAnalytics(suppliersCounts);

    return { counts };
  }

  function formatSuppliersAnalytics(suppliersCounts) {
    const companies = extractSuppliersCountByType(suppliersCounts, SUPPLIER_TYPES.COMPANY);
    const individuals = extractSuppliersCountByType(suppliersCounts, SUPPLIER_TYPES.INDIVIDUAL);

    return { companies, individuals, total: companies + individuals };
  }

  function extractSuppliersCountByType(suppliersCounts, type) {
    const suppliersCount = suppliersCounts.find(({ _id }) => _id === type);

    return suppliersCount ? suppliersCount.count : 0;
  }

  return { execute };
};
