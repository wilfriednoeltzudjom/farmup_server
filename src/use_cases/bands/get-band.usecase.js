const { findBandById } = require('./helpers/band.helper');

module.exports = function buildGetBand() {
  async function execute({ bandId } = {}) {
    return findBandById(bandId);
  }

  return { execute };
};
