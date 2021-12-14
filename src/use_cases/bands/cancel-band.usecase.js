const { BadRequestError } = require('../../application/helpers/errors');
const { BAND_STATUSES } = require('../../database/enums');
const { findBandById } = require('./helpers/band.helper');

module.exports = function buildCancelBand(dependencies) {
  const { dataValidator } = dependencies;

  async function execute({ bandId, ...data } = {}) {
    validateData(data);

    const band = await findBandById(bandId);
    ensureBandIsCancellable(band);
    applyUpdatesOnBand(band, data);

    return band.save();
  }

  function validateData({ comment }) {
    dataValidator.validateString(comment, 'Band comment');
  }

  function ensureBandIsCancellable(band) {
    if (band.status !== BAND_STATUSES.RUNNING) throw new BadRequestError(`You can only cancel a running band. Your band status is ${band.status}.`);
  }

  function applyUpdatesOnBand(band, { comment }) {
    Object.assign(band, { comment, cancelledAt: new Date(), status: BAND_STATUSES.CANCELLED });
  }

  return { execute };
};
