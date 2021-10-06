const BasicError = require('./BasicError');

class SessionExpiredError extends BasicError {
  constructor(message) {
    super(message, 'SessionExpiredError', 440);
  }
}

module.exports = SessionExpiredError;
