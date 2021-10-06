class BasicError extends Error {
  constructor(message, name = 'BasicError', status = 500) {
    super(message);

    this.name = name;
    this.status = status;
  }

  toString() {
    return `${this.name}: [${this.status}] - ${this.message}`;
  }
}

module.exports = BasicError;
