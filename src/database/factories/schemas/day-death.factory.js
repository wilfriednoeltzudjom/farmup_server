const { factory } = require('fakingoose');

const { dayDeathSchema } = require('../../schemas');

module.exports = function buildDayDeathFactory({ defaultOptions }) {
  function generateDayDeath(data = {}, options = {}) {
    return Object.assign(factory(dayDeathSchema, { ...defaultOptions, ...options }).generate(), data);
  }

  return { generateDayDeath };
};
