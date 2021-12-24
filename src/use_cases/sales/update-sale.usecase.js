const { findSaleById, formatSaleData } = require('./helpers/sale.helper');

module.exports = function buildUpdateSaleUseCase() {
  async function execute({ saleId, ...data } = {}) {
    const sale = await findSaleById(saleId);
    formatSaleData(data);
    removeFreezedProperties(data);
    Object.assign(sale, data);
    await sale.save();

    return findSaleById(sale.id);
  }

  function removeFreezedProperties(data) {
    delete data.quantity;
  }

  return { execute };
};
