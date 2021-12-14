const { Day } = require('../../database/models');
const { findBandById } = require('../bands/helpers/band.helper');

module.exports = function buildCreateBand() {
  async function execute({ bandId } = {}) {
    const band = await findBandById(bandId);

    return Day.find({ band }).sort({ chickensAge: 1 });
  }

  return { execute };
};
