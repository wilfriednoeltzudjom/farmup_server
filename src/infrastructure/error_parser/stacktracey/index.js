const StackTracey = require('stacktracey');

const ErrorParser = require('../interface');

module.exports = class StackTraceyErrorParser extends ErrorParser {
  parseErrorAsString(error) {
    if (typeof error === 'string') return error;

    const errorString = new StackTracey(error).withSources().asTable();

    return error.message ? error.message.concat('\n'.concat(errorString)) : '';
  }
};
