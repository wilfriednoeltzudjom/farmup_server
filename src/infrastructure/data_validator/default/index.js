const { isNotNull, isString, isNumber, isBoolean, isArray, isEnum } = require('../../../application/helpers/types.helper');

const DataValidator = require('../interface');

module.exports = class DefaultDataValidator extends DataValidator {
  validateString(value, errorMessagePrefix) {
    if (isNotNull(value) && !isString(value)) super.validateString(value, errorMessagePrefix);
  }

  validateNumber(value, errorMessagePrefix) {
    if (isNotNull(value) && !isNumber(value)) super.validateNumber(value, errorMessagePrefix);
  }

  validateBoolean(value, errorMessagePrefix) {
    if (isNotNull(value) && !isBoolean(value)) super.validateBoolean(value, errorMessagePrefix);
  }

  validateArray(value, errorMessagePrefix) {
    if (isNotNull(value) && !isArray(value)) super.validateArray(value, errorMessagePrefix);
  }

  validateEnum(enumeration, value, errorMessagePrefix) {
    if (isNotNull(value) && !isEnum(enumeration, value)) super.validateArray(value, errorMessagePrefix);
  }
};
