const dependencies = require('../infrastructure');
const buildAuthController = require('./auth.controller');
const buildBandController = require('./band.controller');
const buildDayController = require('./day.controller');
const buildSupplierController = require('./supplier.controller');
const buildFileController = require('./file.controller');

module.exports = {
  authController: buildAuthController(dependencies),
  bandController: buildBandController(dependencies),
  dayController: buildDayController(dependencies),
  supplierController: buildSupplierController(dependencies),
  fileController: buildFileController(dependencies),
};
