const { UnauthorizedError } = require('../../../../application/helpers/errors');
const { TOKEN_COOKIE, SESSION_ID_COOKIE } = require('../../../../application/helpers/constants');
const tokenUtils = require('../../../security/token_utils');

module.exports = function (req, _, next) {
  const token = extractTokenFromRequest(req);
  tokenUtils.verifyToken(token);
  req.user = tokenUtils.decodeToken(token).payload;
  req.user.sessionId = extractSessionIdFromRequest(req);
  next();
};

function extractTokenFromRequest(req) {
  const tokenFromCookie = req.cookies[TOKEN_COOKIE];
  if (!tokenFromCookie) throw new UnauthorizedError('You are not allowed to access this resource: token was not found');

  return tokenFromCookie;
}

function extractSessionIdFromRequest(req) {
  return req.cookies[SESSION_ID_COOKIE];
}
