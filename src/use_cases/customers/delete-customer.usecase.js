const { BadRequestError } = require('../../application/helpers/errors');
const { customerMessages } = require('../../application/messages');
const { Customer, Sale } = require('../../database/models');
const { findCustomerById } = require('./helpers/customer.helper');

module.exports = function buildDeleteCustomer() {
  async function execute({ customerId } = {}) {
    const customer = await findCustomerById(customerId);
    await ensureThereIsNoSalesRelatedToCustomer(customer);
    const { deletedCount } = await Customer.deleteOne({ _id: customer.id });
    if (deletedCount !== 1) throw new BadRequestError(`Error while deleting customer: ${customerId}`);

    return customer;
  }

  async function ensureThereIsNoSalesRelatedToCustomer(customer) {
    const matchingSalesCount = await Sale.countDocuments({ customer });
    if (matchingSalesCount > 0) throw new BadRequestError(customerMessages.CUSTOMER_NON_DELETABLE.FR);
  }

  return { execute };
};
