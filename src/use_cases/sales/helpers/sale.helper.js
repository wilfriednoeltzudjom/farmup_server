const { ResourceNotFoundError } = require('../../../application/helpers/errors');
const { isNonEmptyObject } = require('../../../application/helpers/types.helper');
const { Sale } = require('../../../database/models');

async function findSaleById(saleId) {
  const sale = await Sale.findById(saleId).populate('customer');
  if (!sale) throw new ResourceNotFoundError(`No sale found for id: ${saleId}`);

  return sale;
}

function formatSaleData(data) {
  if (isNonEmptyObject(data.customer)) {
    data.customer = data.customer.id;
  }

  return data;
}

module.exports = { findSaleById, formatSaleData };
