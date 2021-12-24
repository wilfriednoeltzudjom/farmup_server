const { factory } = require('fakingoose');

const { Band } = require('../../models');

const factoryOptions = {
  startedAt: { skip: true },
  broodingEndedAt: { skip: true },
  cancelledAt: { skip: true },
  endedAt: { skip: true },
  chickensStartAge: { skip: true },
  chickensCurrentAge: { skip: true },
  chickensStartCount: { skip: true },
  chickensDeathsCount: { skip: true },
  chickensSalesCount: { skip: true },
  chickensDeathRate: { skip: true },
};

module.exports = function buildBandFactory({ defaultOptions }) {
  function generateBand(data = {}, options = {}) {
    return Object.assign(factory(Band, { ...defaultOptions, ...factoryOptions, ...options }).generate(), data);
  }

  async function createBand(data = {}, options = {}) {
    const band = await new Band(generateBand(data, options));

    return band.save();
  }

  return { generateBand, createBand };
};
