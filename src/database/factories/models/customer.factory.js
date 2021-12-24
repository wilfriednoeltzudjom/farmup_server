const { factory } = require('fakingoose');

const { Customer } = require('../../models');

const factoryOptions = {
  email: { type: 'email' },
};

module.exports = function buildCustomerFactory({ defaultOptions }) {
  function generateCustomer(data = {}, options = {}) {
    return Object.assign(factory(Customer, { ...defaultOptions, ...factoryOptions, ...options }).generate(), data);
  }

  async function createCustomer(data = {}, options = {}) {
    const sale = await new Customer(generateCustomer(data, options));

    return sale.save();
  }

  return { generateCustomer, createCustomer };
};
