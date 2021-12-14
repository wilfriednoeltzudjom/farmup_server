const { ResourceNotFoundError, BadRequestError } = require('../../../application/helpers/errors');
const { escapeRegExp } = require('../../../application/helpers/text.helper');
const { isNullish } = require('../../../application/helpers/types.helper');
const { supplierMessages } = require('../../../application/messages');
const { SUPPLIER_TYPES } = require('../../../database/enums');
const { Supplier } = require('../../../database/models');

function ensureSupplierHasName(supplier) {
  if (supplier.type === SUPPLIER_TYPES.COMPANY && isNullish(supplier.name)) throw new BadRequestError('Supplier name is required.');
  if (supplier.type === SUPPLIER_TYPES.INDIVIDUAL && isNullish(supplier.lastName)) throw new BadRequestError('Supplier lastName is required.');
}

async function ensureSupplierPhoneIsNotAlreadyTaken(supplier) {
  if (!supplier.phone) return;

  const matchingSuppliersCount = await Supplier.countDocuments({ _id: { $ne: supplier.id }, phone: new RegExp(escapeRegExp(supplier.phone), 'i') });
  if (matchingSuppliersCount > 0) throw new BadRequestError(supplierMessages.SUPPLIER_PHONE_ALREADY_TAKEN.FR);
}

async function ensureSupplierEmailIsNotAlreadyTaken(supplier) {
  if (!supplier.email) return;

  const matchingSuppliersCount = await Supplier.countDocuments({ _id: { $ne: supplier.id }, email: new RegExp(supplier.email, 'i') });
  if (matchingSuppliersCount > 0) throw new BadRequestError(supplierMessages.SUPPLIER_EMAIL_ALREADY_TAKEN.FR);
}

async function findSupplierById(supplierId) {
  const supplier = await Supplier.findById(supplierId);
  if (!supplier) throw new ResourceNotFoundError(`No supplier for id: <${supplierId}>`);

  return supplier;
}

module.exports = { ensureSupplierHasName, ensureSupplierPhoneIsNotAlreadyTaken, ensureSupplierEmailIsNotAlreadyTaken, findSupplierById };
