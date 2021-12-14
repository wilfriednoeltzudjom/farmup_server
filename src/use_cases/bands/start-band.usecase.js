const { BadRequestError } = require('../../application/helpers/errors');
const { BAND_STATUSES } = require('../../database/enums');
const { findBandById, initializeDays } = require('./helpers/band.helper');

module.exports = function buildStartBand(dependencies) {
  const { dataValidator, dateUtils } = dependencies;

  async function execute({ bandId, ...data } = {}) {
    validateData(data);

    const band = await findBandById(bandId);
    ensureBandIsPending(band);
    applyUpdatesOnBand(band, data);
    await band.save();
    await initializeDays(band);

    return band;
  }

  function validateData({ startedAt, chickensStartAge, chickensStartCount }) {
    dataValidator.validateDateAsRequired(startedAt, 'Band startedAt');
    dataValidator.validateNumberAsRequired(chickensStartAge, 'Band chickensStartAge');
    dataValidator.validateNumberAsRequired(chickensStartCount, 'Band chickensStartCount');
    ensureStartDateIsBeforeOrEqualTheCurrentDate(startedAt);
  }

  function ensureBandIsPending(band) {
    if (band.status !== BAND_STATUSES.PENDING) throw new BadRequestError(`You can only start a pending band. Your band status is ${band.status}.`);
  }

  function ensureStartDateIsBeforeOrEqualTheCurrentDate(startedAt) {
    if (dateUtils.isAfter({ dateAfter: startedAt })) {
      throw new BadRequestError('La date de démarrage doit être antérieure ou égale à la date du jour.');
    }
  }

  function applyUpdatesOnBand(band, { startedAt, chickensStartAge, chickensStartCount }) {
    const chickensCurrentAge = dateUtils.diff({ dateBefore: startedAt }) + chickensStartAge;
    Object.assign(band, { startedAt, chickensStartAge, chickensCurrentAge, chickensStartCount, status: BAND_STATUSES.RUNNING });
  }

  return { execute };
};
