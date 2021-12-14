const { factory } = require('fakingoose');

const { Day } = require('../../models');

module.exports = function buildDayFactory({ defaultOptions }) {
  function generateDay(data = {}, options = {}) {
    return Object.assign(factory(Day, { ...defaultOptions, ...options }).generate(), data);
  }

  async function createDay(data = {}, options = {}) {
    const day = await new Day(generateDay(data, options));

    return day.save();
  }

  return { generateDay, createDay };
};
