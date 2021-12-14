const { isNotNull } = require('../../application/helpers/types.helper');
const { findDayById, ensureObjectDateIsSameAsDay } = require('./helpers/day.helper');

module.exports = function buildUpdateDayAlimentation(dependencies) {
  const { dataValidator } = dependencies;

  async function execute({ dayId, alimentationId, ...data } = {}) {
    validateData(data);

    const day = await findDayById(dayId);
    ensureObjectDateIsSameAsDay(data, day);
    day.alimentations = day.alimentations.map((alimentation) => {
      return alimentation.id === alimentationId ? Object.assign(alimentation, data) : alimentation;
    });

    return day.save();
  }

  function validateData({ category, date, name, comment, quantity, unit }) {
    if (isNotNull(category)) dataValidator.validateStringAsRequired(category, 'Alimentation category', { allowEmpty: false });
    dataValidator.validateDate(date, 'Alimentation date');
    dataValidator.validateString(name, 'Alimentation name');
    dataValidator.validateString(comment, 'Alimentation comment');
    dataValidator.validateNumber(quantity, 'Alimentation quantity');
    dataValidator.validateString(unit, 'Alimentation unit');
  }

  return { execute };
};
