const { BadRequestError } = require('../../application/helpers/errors');
const bandMessages = require('../../application/messages/band.messages');
const { BAND_STATUSES } = require('../../database/enums');
const { findBandById } = require('./helpers/band.helper');

module.exports = function buildEndBand() {
  async function execute({ bandId } = {}) {
    const band = await findBandById(bandId);
    ensureBandIsRunning(band);
    ensureBandIsFinishable(band);
    Object.assign(band, { status: BAND_STATUSES.ENDED, endedAt: new Date() });

    return band.save();
  }

  function ensureBandIsRunning(band) {
    if (band.status !== BAND_STATUSES.RUNNING) throw new BadRequestError(`You can only end a running band. Your band status is ${band.status}.`);
  }

  function ensureBandIsFinishable({ chickensStartCount, chickensSalesCount, chickensDeathsCount }) {
    if (chickensStartCount !== chickensSalesCount + chickensDeathsCount) {
      throw new BadRequestError(bandMessages.BAND_NON_FINISHABLE.FR);
    }
  }

  return { execute };
};
