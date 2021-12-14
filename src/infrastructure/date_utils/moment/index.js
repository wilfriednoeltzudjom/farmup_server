const moment = require('moment');
const mockdate = require('mockdate');

const DateUtils = require('../interface');

module.exports = class MomentDateUtils extends DateUtils {
  isAfter({ dateAfter = moment(), dateBefore = moment(), dateUnit = 'days' } = {}) {
    return moment(dateAfter).isAfter(dateBefore, dateUnit);
  }

  isEqual({ comparedDate = moment(), date = moment(), dateUnit = 'days' } = {}) {
    return moment(comparedDate).isSame(date, dateUnit);
  }

  diff({ dateAfter = moment(), dateBefore = moment(), dateUnit = 'days' } = {}) {
    let formattedDateAfer = dateAfter;
    let formattedDateBefore = dateBefore;
    if (dateUnit === 'days') {
      formattedDateAfer = moment(dateAfter).format('YYYY-MM-DD');
      formattedDateBefore = moment(dateBefore).format('YYYY-MM-DD');
    }

    return Math.round(moment(formattedDateAfer).diff(formattedDateBefore, dateUnit, true));
  }

  add({ date = moment(), amount = 0, dateUnit = 'days' } = {}) {
    return moment(date).add(amount, dateUnit).toDate();
  }

  substract({ date = moment(), amount = 0, dateUnit = 'days' } = {}) {
    return moment(date).subtract(amount, dateUnit).toDate();
  }

  now() {
    return moment().toDate();
  }

  mockDate(date) {
    mockdate.set(date);
  }

  resetDate() {
    mockdate.reset();
  }
};
