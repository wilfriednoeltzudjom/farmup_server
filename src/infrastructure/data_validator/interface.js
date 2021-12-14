const { BadRequestError, UnsupportedMediaTypeError } = require('../../application/helpers/errors');
const { isNullish, isEmpty } = require('../../application/helpers/types.helper');
const { ASSET_MIME_TYPES } = require('../../database/enums');

module.exports = class DataValidator {
  validateValueAsRequired(value, errorMessagePrefix) {
    if (isNullish(value)) throw new BadRequestError(`${errorMessagePrefix} is required`);
  }

  validateString(value, errorMessagePrefix) {
    throw new BadRequestError(`${errorMessagePrefix} must be a valid string: ${value}`);
  }

  validateStringAsRequired(value, errorMessagePrefix, { allowEmpty = true } = {}) {
    this.validateValueAsRequired(value, errorMessagePrefix);
    this.validateString(value, errorMessagePrefix);
    if (!allowEmpty && isEmpty(value)) throw new BadRequestError(`${errorMessagePrefix} must not be empty`);
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

  validateDate(value, errorMessagePrefix) {
    throw new BadRequestError(`${errorMessagePrefix} must be a valid date: ${value}`);
  }

  validateDateAsRequired(value, errorMessagePrefix) {
    this.validateValueAsRequired(value, errorMessagePrefix);
    this.validateDate(value, errorMessagePrefix);
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

  validateFileAsRequired(file) {
    if (!file) throw new BadRequestError('File resource is required');
    if (!file.mimetype) throw new BadRequestError('File resource must includes a mimetype property');
    if (!file.buffer) throw new BadRequestError('File resource must includes a buffer property');
    if (!Buffer.isBuffer(file.buffer)) throw new BadRequestError('File resource buffer mus be valid');

    const supportedMediaTypes = Object.values(ASSET_MIME_TYPES);
    if (!supportedMediaTypes.includes(file.mimetype)) {
      throw new UnsupportedMediaTypeError(`File resource mimetype must be one of [${supportedMediaTypes}]`);
    }
  }
};
