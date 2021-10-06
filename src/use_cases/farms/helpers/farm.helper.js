const { ResourceNotFoundError } = require('../../../application/helpers/errors');
const { Farm } = require('../../../database/models');

async function findFarmById(farmId) {
  const farm = await Farm.findById(farmId);
  if (!farm) throw new ResourceNotFoundError(`No farm found for id: ${farmId}`);

  return farm;
}

module.exports = { findFarmById };
