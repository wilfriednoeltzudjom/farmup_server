const { ResourceNotFoundError, BadRequestError } = require('../../../application/helpers/errors');
const { Day } = require('../../../database/models');
const { dateUtils } = require('../../../infrastructure');

async function findDayById(dayId) {
  const day = await Day.findById(dayId);
  if (!day) throw new ResourceNotFoundError(`No day found for id: ${dayId}`);

  return day;
}

function ensureObjectDateIsSameAsDay(object, day) {
  if (object.date && !dateUtils.isEqual({ comparedDate: day.date, date: object.date })) {
    throw new BadRequestError('La date saisie doit être égale à celle du jour');
  }
}

async function getDaysAfterDay(day) {
  return Day.find({ band: day.band, date: { $gt: day.date } });
}

module.exports = { findDayById, ensureObjectDateIsSameAsDay, getDaysAfterDay };
