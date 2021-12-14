const { factory } = require('fakingoose');

const { dayAlimentationSchema } = require('../../schemas');

module.exports = function buildDayAlimentationFactory({ defaultOptions }) {
  function generateDayAlimentation(data = {}, options = {}) {
    return Object.assign(factory(dayAlimentationSchema, { ...defaultOptions, ...options }).generate(), data);
  }

  return { generateDayAlimentation };
};
