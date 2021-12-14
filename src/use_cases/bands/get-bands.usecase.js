const { Band } = require('../../database/models');
const { findFarmById } = require('../farms/helpers/farm.helper');

module.exports = function buildGetBands() {
  async function execute({ farmId, ...options } = {}) {
    const farm = await findFarmById(farmId);
    const promisesChain = Band.find({ farm }).sort({ createdAt: -1 });

    return options.limit ? promisesChain.limit(options.limit) : promisesChain;
  }

  return { execute };
};
