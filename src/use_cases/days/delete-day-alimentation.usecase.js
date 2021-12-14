const { findDayById } = require('./helpers/day.helper');

module.exports = function buildDeleteDayAlimentation() {
  async function execute({ dayId, alimentationId } = {}) {
    const day = await findDayById(dayId);
    day.alimentations = day.alimentations.filter((alimentation) => alimentation.id !== alimentationId);

    return day.save();
  }

  return { execute };
};
