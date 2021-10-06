const { BadRequestError } = require('../../application/helpers/errors');
const { isNullish } = require('../../application/helpers/types.helper');

module.exports = class DataValidator {
  validateValueAsRequired(value, errorMessagePrefix) {
    if (isNullish(value)) throw new BadRequestError(`${errorMessagePrefix} is required`);
  }

  validateString(value, errorMessagePrefix) {
    throw new BadRequestError(`${errorMessagePrefix} must be a valid string: ${value}`);
  }

  validateStringAsRequired(value, errorMessagePrefix) {
    this.validateValueAsRequired(value, errorMessagePrefix);
    this.validateString(value, errorMessagePrefix);
  }

  validateNumber(value, errorMessagePrefix) {
    throw new BadRequestError(`${errorMessagePrefix} must be a valid number: ${value}`);
  }

  validateNumberAsRequired(value, errorMessagePrefix) {
    this.validateValueAsRequired(value, errorMessagePrefix);
    this.validateNumber(value, errorMessagePrefix);
  }

  validateBoolean(value, errorMessagePrefix) {
    throw new BadRequestError(`${errorMessagePrefix} must be a valid boolean: ${value}`);
  }

  validateBooleanAsRequired(value, errorMessagePrefix) {
    this.validateValueAsRequired(value, errorMessagePrefix);
    this.validateBoolean(value, errorMessagePrefix);
  }

  validateArray(value, errorMessagePrefix) {
    throw new BadRequestError(`${errorMessagePrefix} must be a valid array: ${value}`);
  }

  validateArrayAsRequired(value, errorMessagePrefix) {
    this.validateValueAsRequired(value, errorMessagePrefix);
    this.validateArray(value, errorMessagePrefix);
  }

  validateEnum(value, errorMessagePrefix) {
    throw new BadRequestError(`${errorMessagePrefix} must be a valid enum: ${value}`);
  }

  validateEnumAsRequired(enumeration, value, errorMessagePrefix) {
    this.validateValueAsRequired(value, errorMessagePrefix);
    this.validateEnum(enumeration, value, errorMessagePrefix);
  }
};
