const { BadRequestError } = require('../../application/helpers/errors');
const { BAND_STATUSES } = require('../../database/enums');
const { Band, Prophylaxis } = require('../../database/models');
const { findFarmById } = require('../farms/helpers/farm.helper');
const { initializeDays } = require('./helpers/band.helper');

module.exports = function buildCreateBand(dependencies) {
  const { dataValidator, dateUtils } = dependencies;

  async function execute({ farmId, ...data } = {}) {
    validateData(data);

    const farm = await findFarmById(farmId);
    const band = new Band({ ...data, farm });
    await setCode(band, farm);
    setChickensCurrentAge(band);
    await setProphylaxis(band, farm);
    await band.save();
    await initializeDays(band);

    return band;
  }

  function validateData({ chickensStartCount, chickensStartAge, startedAt }) {
    dataValidator.validateNumberAsRequired(chickensStartCount, 'Band chickensStartCount');
    dataValidator.validateNumberAsRequired(chickensStartAge, 'Band chickensStartAge');
    ensureStartDateIsBeforeOrEqualTheCurrentDate(startedAt);
  }

  function ensureStartDateIsBeforeOrEqualTheCurrentDate(startedAt) {
    if (startedAt && dateUtils.isAfter({ dateAfter: startedAt })) {
      throw new BadRequestError('La date de démarrage doit être antérieure ou égale à la date du jour.');
    }
  }

  async function setCode(band, farm) {
    const bands = await Band.find({ farm }).sort({ createdAt: -1 });
    let lastBandPosition = 0;
    if (bands.length > 0) {
      const lastBand = bands[0];
      lastBandPosition = Number(lastBand.code.slice(2));
    }
    band.code = 'BA'.concat(String(lastBandPosition + 1).padStart(5, '0'));
  }

  function setChickensCurrentAge(band) {
    const { startedAt, chickensStartAge } = band;
    if (startedAt) {
      band.chickensCurrentAge = dateUtils.diff({ dateBefore: band.startedAt }) + chickensStartAge;
      band.status = BAND_STATUSES.RUNNING;
    }
  }

  async function setProphylaxis(band, farm) {
    const prophylaxis = await Prophylaxis.findOne({ farm });
    if (prophylaxis) band.prophylaxis = prophylaxis;
  }

  return { execute };
};
