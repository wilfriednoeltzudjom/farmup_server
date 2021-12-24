const { factory } = require('fakingoose');

const { Farm } = require('../../models');

module.exports = function buildFarmFactory({ defaultOptions }) {
  function generateFarm(data = {}, options = {}) {
    return Object.assign(factory(Farm, { ...defaultOptions, ...options }).generate(), data);
  }

  async function createFarm(data = {}, options = {}) {
    const farm = new Farm(generateFarm(data, options));

    return farm.save();
  }

  return { generateFarm, createFarm };
};
