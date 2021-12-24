const { Customer } = require('../../database/models');
const { findFarmById } = require('../farms/helpers/farm.helper');
const { ensureCustomerHasName, ensureCustomerPhoneIsNotAlreadyTaken, ensureCustomerEmailIsNotAlreadyTaken } = require('./helpers/customer.helper');

module.exports = function buildCreateCustomerUseCase(dependencies) {
  const { dataValidator } = dependencies;

  async function execute({ farmId, ...data } = {}) {
    validateData(data);

    const farm = await findFarmById(farmId);
    const customer = new Customer({ ...data, farm });
    ensureCustomerHasName(customer);
    await setCode(customer, farm);
    await ensureCustomerPhoneIsNotAlreadyTaken(customer);
    await ensureCustomerEmailIsNotAlreadyTaken(customer);

    return customer.save();
  }

  function validateData({ type, name, lastName, firstName, email, phone, addressText }) {
    dataValidator.validateStringAsRequired(type, 'Customer type');
    dataValidator.validateString(name, 'Customer name');
    dataValidator.validateString(lastName, 'Customer lastName');
    dataValidator.validateString(firstName, 'Customer firstName');
    dataValidator.validateString(email, 'Customer email');
    dataValidator.validateString(phone, 'Customer phone');
    dataValidator.validateString(addressText, 'Customer addressText');
  }

  async function setCode(customer, farm) {
    const customers = await Customer.find({ farm }).sort({ createdAt: -1 }).limit(1);
    let nextCustomerPosition = 0;
    if (customers.length > 0) {
      nextCustomerPosition = Number(customers[0].code.slice(2));
    }
    customer.code = 'CU'.concat(String(nextCustomerPosition + 1).padStart(5, '0'));
  }

  return { execute };
};
