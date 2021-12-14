const { findDayById, ensureObjectDateIsSameAsDay } = require('./helpers/day.helper');

module.exports = function buildAddDayAlimentation(dependencies) {
  const { dataValidator } = dependencies;

  async function execute({ dayId, ...data } = {}) {
    validateData(data);

    const day = await findDayById(dayId);
    ensureObjectDateIsSameAsDay(data, day);
    day.alimentations.push(data);

    return day.save();
  }

  function validateData({ category, date, name, comment, quantity, unit }) {
    dataValidator.validateStringAsRequired(category, 'Alimentation category', { allowEmpty: false });
    dataValidator.validateDateAsRequired(date, 'Alimentation date');
    dataValidator.validateString(name, 'Alimentation name');
    dataValidator.validateString(comment, 'Alimentation comment');
    dataValidator.validateNumberAsRequired(quantity, 'Alimentation category');
    dataValidator.validateStringAsRequired(unit, 'Alimentation quantity');
  }

  return { execute };
};
