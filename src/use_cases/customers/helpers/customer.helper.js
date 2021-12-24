const { ResourceNotFoundError, BadRequestError } = require('../../../application/helpers/errors');
const { escapeRegExp } = require('../../../application/helpers/text.helper');
const { isNullish } = require('../../../application/helpers/types.helper');
const { customerMessages } = require('../../../application/messages');
const { CUSTOMER_TYPES } = require('../../../database/enums');
const { Customer } = require('../../../database/models');

function ensureCustomerHasName(customer) {
  if (customer.type === CUSTOMER_TYPES.COMPANY && isNullish(customer.name)) throw new BadRequestError('Customer name is required.');
  if (customer.type === CUSTOMER_TYPES.INDIVIDUAL && isNullish(customer.lastName)) throw new BadRequestError('Customer lastName is required.');
}

async function ensureCustomerPhoneIsNotAlreadyTaken(customer) {
  if (!customer.phone) return;

  const matchingCustomersCount = await Customer.countDocuments({ _id: { $ne: customer.id }, phone: new RegExp(escapeRegExp(customer.phone), 'i') });
  if (matchingCustomersCount > 0) throw new BadRequestError(customerMessages.CUSTOMER_PHONE_ALREADY_TAKEN.FR);
}

async function ensureCustomerEmailIsNotAlreadyTaken(customer) {
  if (!customer.email) return;

  const matchingCustomersCount = await Customer.countDocuments({ _id: { $ne: customer.id }, email: new RegExp(customer.email, 'i') });
  if (matchingCustomersCount > 0) throw new BadRequestError(customerMessages.CUSTOMER_EMAIL_ALREADY_TAKEN.FR);
}

async function findCustomerById(customerId) {
  const customer = await Customer.findById(customerId);
  if (!customer) throw new ResourceNotFoundError(`No customer for id: <${customerId}>`);

  return customer;
}

module.exports = { ensureCustomerHasName, ensureCustomerPhoneIsNotAlreadyTaken, ensureCustomerEmailIsNotAlreadyTaken, findCustomerById };
