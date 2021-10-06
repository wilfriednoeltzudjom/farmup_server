const jwt = require('jsonwebtoken');

const TokenUtils = require('../interface');
const { SessionExpiredError } = require('../../../../application/helpers/errors');

const defaultOptions = {
  issuer: 'hlg',
  algorithm: 'RS512',
};

module.exports = class JwtTokenUtils extends TokenUtils {
  generateToken(payload, options = {}) {
    return jwt.sign(payload, formatEnvKey(process.env.PRIVATE_KEY), Object.assign({}, defaultOptions, options));
  }

  verifyToken(token) {
    const { issuer, algorithm } = defaultOptions;

    try {
      jwt.verify(token, formatEnvKey(process.env.PUBLIC_KEY), { issuer, algorithms: [algorithm] });
    } catch (error) {
      if (error.name === 'TokenExpiredError') throw new SessionExpiredError(`You are allowed to access this resource: token ${token} has expired`);
      throw new UnauthorizedError(`You are allowed to access this resource: token ${token} is not recognized`);
    }
  }

  decodeToken(token) {
    return jwt.decode(token, { complete: true });
  }
};

function formatEnvKey(key = '') {
  return key.replace(/\\n/gm, '\n');
}
