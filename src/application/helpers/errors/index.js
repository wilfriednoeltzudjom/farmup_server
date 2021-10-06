const BasicError = require('./BasicError');
const UnauthorizedError = require('./UnauthorizedError');
const ResourceNotFoundError = require('./ResourceNotFoundError');
const BadRequestError = require('./BadRequestError');
const ParameterError = require('./ParameterError');
const UnsupportedMediaTypeError = require('./UnsupportedMediaTypeError');
const SessionExpiredError = require('./SessionExpiredError');

const { isNullish } = require('../types.helper');

function ensureValuesAreProvided(values = [], errorMessage) {
  values.forEach((value) => {
    if (isNullish(value)) throw new ParameterError(errorMessage);
  });
}

module.exports = {
  BasicError,
  BadRequestError,
  UnauthorizedError,
  ResourceNotFoundError,
  ParameterError,
  UnsupportedMediaTypeError,
  SessionExpiredError,
  ensureValuesAreProvided,
};
