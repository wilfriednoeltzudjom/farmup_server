const { factory } = require('fakingoose');

const { Day } = require('../../models');

const factoryOptions = {
  chickensCount: { skip: true },
  chickensAge: { skip: true },
  chickensWeight: { skip: true },
  chickensMinimumWeight: { skip: true },
  chickensMaximumWeight: { skip: true },
  buildingTemperature: { skip: true },
  buildingHumidity: { skip: true },
  alimentations: { skip: true },
  medecines: { skip: true },
  observations: { skip: true },
  deaths: { skip: true },
};

module.exports = function buildDayFactory({ defaultOptions }) {
  function generateDay(data = {}, options = {}) {
    return Object.assign(factory(Day, { ...defaultOptions, ...factoryOptions, ...options }).generate(), data);
  }

  async function createDay(data = {}, options = {}) {
    const day = new Day(generateDay(data, options));

    return day.save();
  }

  return { generateDay, createDay };
};
