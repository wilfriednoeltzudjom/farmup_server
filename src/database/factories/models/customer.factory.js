const { factory } = require('fakingoose');

const { Customer } = require('../../models');

module.exports = function buildCustomerFactory({ defaultOptions }) {
  function generateCustomer(data = {}, options = {}) {
    return Object.assign(factory(Customer, { ...defaultOptions, ...options }).generate(), data);
  }

  async function createCustomer(data = {}, options = {}) {
    const sale = await new Customer(generateCustomer(data, options));

    return sale.save();
  }

  return { generateCustomer, createCustomer };
};
