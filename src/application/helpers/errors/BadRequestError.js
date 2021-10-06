const BasicError = require('./BasicError');

class BadRequestError extends BasicError {
  constructor(message) {
    super(message, 'BadRequestError', 400);
  }
}

module.exports = BadRequestError;
