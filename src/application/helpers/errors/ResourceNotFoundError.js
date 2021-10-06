const BasicError = require('./BasicError');

class ResourceNotFoundError extends BasicError {
  constructor(message) {
    super(message, 'ResourceNotFoundError', 404);
  }
}

module.exports = ResourceNotFoundError;
