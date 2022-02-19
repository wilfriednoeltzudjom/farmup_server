const { factory } = require('fakingoose');

const { Sale } = require('../../models');

const factoryOptions = {
  totalPrice: { skip: true },
};

module.exports = function buildSaleFactory({ defaultOptions, dateUtils }) {
  function generateSale(data = {}, options = {}) {
    const sale = factory(Sale, { ...defaultOptions, ...factoryOptions, ...options }).generate();
    if (sale.date) sale.date = dateUtils.now();

    return Object.assign(sale, data);
  }

  async function createSale(data = {}, options = {}) {
    const sale = new Sale(generateSale(data, options));

    return sale.save();
  }

  return { generateSale, createSale };
};
