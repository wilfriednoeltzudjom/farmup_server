const { factory } = require('fakingoose');

const { Sale } = require('../../models');

const factoryOptions = {
  quantity: { skip: true },
  unitPrice: { skip: true },
  totalPrice: { skip: true },
};

module.exports = function buildSaleFactory({ defaultOptions }) {
  function generateSale(data = {}, options = {}) {
    return Object.assign(factory(Sale, { ...defaultOptions, ...factoryOptions, ...options }).generate(), data);
  }

  async function createSale(data = {}, options = {}) {
    const sale = await new Sale(generateSale(data, options));

    return sale.save();
  }

  return { generateSale, createSale };
};
