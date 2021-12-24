const dependencies = require('../infrastructure');
const buildAuthController = require('./auth.controller');
const buildBandController = require('./band.controller');
const buildDayController = require('./day.controller');
const buildSupplierController = require('./supplier.controller');
const buildCustomerController = require('./customer.controller');
const buildExpenseController = require('./expense.controller');
const buildSaleController = require('./sale.controller');
const buildFileController = require('./file.controller');

module.exports = {
  authController: buildAuthController(dependencies),
  bandController: buildBandController(dependencies),
  dayController: buildDayController(dependencies),
  supplierController: buildSupplierController(dependencies),
  customerController: buildCustomerController(dependencies),
  expenseController: buildExpenseController(dependencies),
  saleController: buildSaleController(dependencies),
  fileController: buildFileController(dependencies),
};
