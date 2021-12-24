const { ensureCustomerHasName, ensureCustomerPhoneIsNotAlreadyTaken, ensureCustomerEmailIsNotAlreadyTaken, findCustomerById } = require('./helpers/customer.helper');

module.exports = function buildUpdateCustomerUseCase() {
  async function execute({ customerId, ...data } = {}) {
    const customer = await findCustomerById(customerId);
    Object.assign(customer, data);
    ensureCustomerHasName(customer);
    await ensureCustomerPhoneIsNotAlreadyTaken(customer);
    await ensureCustomerEmailIsNotAlreadyTaken(customer);

    return customer.save();
  }

  return { execute };
};
