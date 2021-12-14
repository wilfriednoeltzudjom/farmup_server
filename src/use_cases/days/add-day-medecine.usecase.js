const { findDayById, ensureObjectDateIsSameAsDay } = require('./helpers/day.helper');

module.exports = function buildAddDayMedecine(dependencies) {
  const { dataValidator } = dependencies;

  async function execute({ dayId, ...data } = {}) {
    validateData(data);

    const day = await findDayById(dayId);
    ensureObjectDateIsSameAsDay(data, day);
    day.medecines.push(data);

    return day.save();
  }

  function validateData({ category, date, name, comment, quantity, unit, administrationMode }) {
    dataValidator.validateStringAsRequired(category, 'Medecine category', { allowEmpty: false });
    dataValidator.validateDateAsRequired(date, 'Medecine date');
    dataValidator.validateString(name, 'Medecine name');
    dataValidator.validateString(comment, 'Medecine comment');
    dataValidator.validateString(administrationMode, 'Medecine administrationMode');
    dataValidator.validateNumberAsRequired(quantity, 'Medecine quantity');
    dataValidator.validateStringAsRequired(unit, 'Medecine unit');
  }

  return { execute };
};
