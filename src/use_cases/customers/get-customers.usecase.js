const { Customer } = require('../../database/models');
const { findFarmById } = require('../farms/helpers/farm.helper');

module.exports = function buildGetCustomersUseCase() {
  async function execute({ farmId } = {}) {
    const farm = await findFarmById(farmId);

    return Customer.find({ farm }).sort({ createdAt: -1 });
  }

  return { execute };
};
