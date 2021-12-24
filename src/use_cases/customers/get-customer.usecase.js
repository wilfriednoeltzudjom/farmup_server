const { findCustomerById } = require('./helpers/customer.helper');

module.exports = function buildGetCustomer() {
  async function execute({ customerId } = {}) {
    return findCustomerById(customerId);
  }

  return { execute };
};
