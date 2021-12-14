const { Supplier } = require('../../database/models');
const { findFarmById } = require('../farms/helpers/farm.helper');

module.exports = function buildCreateSuppliersUseCase() {
  async function execute({ farmId } = {}) {
    const farm = await findFarmById(farmId);

    return Supplier.find({ farm }).sort({ createdAt: -1 });
  }

  return { execute };
};
