const { findBandById } = require('./helpers/band.helper');

module.exports = function buildUpdateBand(dependencies) {
  const { dataValidator } = dependencies;

  async function execute({ bandId, ...data } = {}) {
    validateData(data);

    const band = await findBandById(bandId);
    applyUpdates(band, data);

    return band.save();
  }

  function validateData({ broodingEndedAt }) {
    dataValidator.validateDate(broodingEndedAt, 'Brand broodingEndedAt');
  }

  function applyUpdates(band, { broodingEndedAt }) {
    Object.assign(band, { broodingEndedAt });
  }

  return { execute };
};
