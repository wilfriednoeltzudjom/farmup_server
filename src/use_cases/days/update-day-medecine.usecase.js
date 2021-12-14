const { isNotNull } = require('../../application/helpers/types.helper');
const { findDayById, ensureObjectDateIsSameAsDay } = require('./helpers/day.helper');

module.exports = function buildUpdateDayMedecine(dependencies) {
  const { dataValidator } = dependencies;

  async function execute({ dayId, medecineId, ...data } = {}) {
    validateData(data);

    const day = await findDayById(dayId);
    ensureObjectDateIsSameAsDay(data, day);
    day.medecines = day.medecines.map((medecine) => {
      return medecine.id === medecineId ? Object.assign(medecine, data) : medecine;
    });

    return day.save();
  }

  function validateData({ category, date, name, comment, quantity, unit, administrationMode }) {
    if (isNotNull(category)) dataValidator.validateStringAsRequired(category, 'Medecine category', { allowEmpty: false });
    dataValidator.validateDate(date, 'Medecine date');
    dataValidator.validateString(name, 'Medecine name');
    dataValidator.validateString(comment, 'Medecine comment');
    dataValidator.validateString(administrationMode, 'Medecine administrationMode');
    dataValidator.validateNumber(quantity, 'Medecine quantity');
    dataValidator.validateString(unit, 'Medecine unit');
  }

  return { execute };
};
