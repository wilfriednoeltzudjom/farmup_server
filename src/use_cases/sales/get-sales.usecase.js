const { Sale } = require('../../database/models');
const { findBandById } = require('../bands/helpers/band.helper');

module.exports = function buildCreateSaleUseCase() {
  async function execute({ bandId } = {}) {
    const band = await findBandById(bandId);

    return Sale.find({ band }).sort({ createdAt: -1 }).populate('customer');
  }

  return { execute };
};
