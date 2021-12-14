const { factory } = require('fakingoose');

const { dayMedecineSchema } = require('../../schemas');

module.exports = function buildDayMedecineFactory({ defaultOptions }) {
  function generateDayMedecine(data = {}, options = {}) {
    return Object.assign(factory(dayMedecineSchema, { ...defaultOptions, ...options }).generate(), data);
  }

  return { generateDayMedecine };
};
