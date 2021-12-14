const { findDayById } = require('./helpers/day.helper');

module.exports = function buildUpdateDay(dependencies) {
  const { dataValidator } = dependencies;

  async function execute({ dayId, ...data } = {}) {
    validateData(data);

    const day = await findDayById(dayId);
    Object.assign(day, data);

    return day.save();
  }

  function validateData({ chickensMinimumWeight, chickensMaximumWeight, buildingTemperature }) {
    dataValidator.validateNumber(chickensMinimumWeight);
    dataValidator.validateNumber(chickensMaximumWeight);
    dataValidator.validateNumber(buildingTemperature);
  }

  return { execute };
};
