const { ensureSupplierHasName, ensureSupplierPhoneIsNotAlreadyTaken, ensureSupplierEmailIsNotAlreadyTaken, findSupplierById } = require('./helpers/supplier.helper');

module.exports = function buildUpdateSupplierUseCase() {
  async function execute({ supplierId, ...data } = {}) {
    const supplier = await findSupplierById(supplierId);
    Object.assign(supplier, data);
    ensureSupplierHasName(supplier);
    await ensureSupplierPhoneIsNotAlreadyTaken(supplier);
    await ensureSupplierEmailIsNotAlreadyTaken(supplier);

    return supplier.save();
  }

  return { execute };
};
