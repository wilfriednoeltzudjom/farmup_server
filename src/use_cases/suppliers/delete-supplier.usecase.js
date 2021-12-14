const { BadRequestError } = require('../../application/helpers/errors');
const { supplierMessages } = require('../../application/messages');
const { Supplier, Expense } = require('../../database/models');
const { findSupplierById } = require('./helpers/supplier.helper');

module.exports = function buildGetSupplier() {
  async function execute({ supplierId } = {}) {
    const supplier = await findSupplierById(supplierId);
    await ensureThereIsNoExpensesRelatedToSupplier(supplier);
    const { deletedCount } = await Supplier.deleteOne({ _id: supplier.id });
    if (deletedCount !== 1) throw new BadRequestError(`Error while deleting supplier: ${supplierId}`);

    return supplier;
  }

  async function ensureThereIsNoExpensesRelatedToSupplier(supplier) {
    const matchingExpensesCount = await Expense.countDocuments({ supplier });
    if (matchingExpensesCount > 0) throw new BadRequestError(supplierMessages.SUPPLIER_NON_DELETABLE.FR);
  }

  return { execute };
};
