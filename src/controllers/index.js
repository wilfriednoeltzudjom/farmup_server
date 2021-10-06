const dependencies = require('../infrastructure');
const buildAuthController = require('./auth.controller');

module.exports = {
  authController: buildAuthController(dependencies),
};
