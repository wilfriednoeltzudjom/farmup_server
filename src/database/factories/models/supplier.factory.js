const { factory } = require('fakingoose');

const { Supplier } = require('../../models');

const factoryOptions = {
  email: { type: 'email' },
};

module.exports = function buildSupplierFactory({ defaultOptions }) {
  function generateSupplier(data = {}, options = {}) {
    return Object.assign(factory(Supplier, { ...defaultOptions, ...factoryOptions, ...options }).generate(), data);
  }

  async function createSupplier(data = {}, options = {}) {
    const sale = new Supplier(generateSupplier(data, options));

    return sale.save();
  }

  return { generateSupplier, createSupplier };
};
