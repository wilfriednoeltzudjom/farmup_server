const { BadRequestError } = require('../../application/helpers/errors');
const { Sale, Day } = require('../../database/models');
const { findBandById } = require('../bands/helpers/band.helper');
const { findSaleById } = require('./helpers/sale.helper');

module.exports = function buildDeleteSaleUseCase(dependencies) {
  const { fileManager } = dependencies;

  async function execute({ saleId } = {}) {
    const sale = await findSaleById(saleId);
    const { deletedCount } = await Sale.deleteOne({ _id: sale.id });
    if (deletedCount !== 1) throw new BadRequestError(`Error while deleting sale: ${saleId}`);
    await deleteAssets(sale);
    await updateBandChickensSalesCount(sale);
    await updateDaysRemainingChickensCount(sale);

    return sale;
  }

  async function deleteAssets({ assets = [] }) {
    return Promise.all(assets.map((asset) => fileManager.deleteFile(asset)));
  }

  async function updateBandChickensSalesCount(sale) {
    const band = await findBandById(sale.band);
    band.chickensSalesCount = band.chickensSalesCount - sale.quantity;
    await band.save();
  }

  async function updateDaysRemainingChickensCount(sale) {
    const band = await findBandById(sale.band);
    const days = await Day.find({ band, date: { $gte: sale.date } });

    return Promise.all(
      days.map((day) => {
        return Day.updateOne({ _id: day.id }, { $inc: { chickensCount: sale.quantity } });
      })
    );
  }

  return { execute };
};
