const BasicError = require('./BasicError');

class UnsupportedMediaTypeError extends BasicError {
  constructor(message) {
    super(message, 'UnsupportedMediaTypeError', 415);
  }
}

module.exports = UnsupportedMediaTypeError;
