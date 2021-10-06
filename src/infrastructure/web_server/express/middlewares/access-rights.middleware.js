const { UnauthorizedError } = require('../../../../application/helpers/errors');

module.exports = function (...authorizedRoles) {
  return function (req, _, next) {
    const { role } = req.user;
    if (!authorizedRoles.includes(role)) {
      throw new UnauthorizedError(`You are allowed to access this resource: role ${role} is not included in the authorized roles`);
    }
    next();
  };
};
