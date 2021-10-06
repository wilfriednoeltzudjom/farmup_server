const bcrypt = require('bcryptjs');

const HashUtils = require('../interface');

module.exports = class BcryptJSHashUtils extends HashUtils {
  async createHash(value) {
    return bcrypt.hash(value, 10);
  }

  async isEqualToHash({ hash, value }) {
    return bcrypt.compare(value, hash);
  }
};
