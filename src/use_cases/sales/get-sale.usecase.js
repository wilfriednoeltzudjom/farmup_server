const { findSaleById } = require('./helpers/sale.helper');

module.exports = function buildDeleteSaleUseCase() {
  async function execute({ saleId } = {}) {
    return findSaleById(saleId);
  }

  return { execute };
};
