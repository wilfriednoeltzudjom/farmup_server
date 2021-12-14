const { findDayById } = require('./helpers/day.helper');

module.exports = function buildDeleteDayMedecine() {
  async function execute({ dayId, medecineId } = {}) {
    const day = await findDayById(dayId);
    day.medecines = day.medecines.filter((medecine) => medecine.id !== medecineId);

    return day.save();
  }

  return { execute };
};
