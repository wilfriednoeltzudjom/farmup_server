const BasicError = require('./BasicError');

class ParameterError extends BasicError {
  constructor(message) {
    super(message, 'ParameterError', 422);
  }
}

module.exports = ParameterError;
