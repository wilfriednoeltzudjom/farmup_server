const { findSupplierById } = require('./helpers/supplier.helper');

module.exports = function buildGetSupplier() {
  async function execute({ supplierId } = {}) {
    return findSupplierById(supplierId);
  }

  return { execute };
};
