const BasicError = require('./BasicError');

class UnauthorizedError extends BasicError {
  constructor(message = 'Access Unauthorized.') {
    super(message, 'UnauthorizedError', 401);
  }
}

module.exports = UnauthorizedError;
