const StackTracey = require('stacktracey');

const ErrorParser = require('../interface');

module.exports = class StackTraceyErrorParser extends ErrorParser {
  parseErrorAsString(error) {
    const errorString = new StackTracey(error).withSources().asTable();

    return error.message.concat('\n'.concat(errorString));
  }
};
