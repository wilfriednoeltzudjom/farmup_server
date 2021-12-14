const { factory } = require('fakingoose');

const { Prophylaxis } = require('../../models');

module.exports = function buildProphylaxisFactory({ defaultOptions }) {
  function generateProphylaxis(data = {}, options = {}) {
    return Object.assign(factory(Prophylaxis, { ...defaultOptions, ...options }).generate(), data);
  }

  async function createProphylaxis(data = {}, options = {}) {
    const farm = await new Prophylaxis(generateProphylaxis(data, options));

    return farm.save();
  }

  return { generateProphylaxis, createProphylaxis };
};
