const uuid = require('uuid');

const IdGenerator = require('../interface');

module.exports = class UUIDIdGeneration extends IdGenerator {
  generateUUID() {
    return uuid.v1();
  }
};
