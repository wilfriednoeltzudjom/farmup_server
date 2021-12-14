const { findDayById } = require('./helpers/day.helper');

module.exports = function buildGetDay() {
  async function execute({ dayId } = {}) {
    return findDayById(dayId);
  }

  return { execute };
};
