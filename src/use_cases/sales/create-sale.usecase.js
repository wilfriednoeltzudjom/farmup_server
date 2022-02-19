const { BadRequestError } = require('../../application/helpers/errors');
const { INVALID_SALE_QUANTITY } = require('../../application/messages/sale.messages');
const { Sale, Day } = require('../../database/models');
const { findBandById } = require('../bands/helpers/band.helper');
const { formatSaleData, findSaleById } = require('./helpers/sale.helper');

module.exports = function buildCreateSaleUseCase(dependencies) {
  const { dataValidator } = dependencies;

  async function execute({ bandId, ...data } = {}) {
    validateData(data);
    formatSaleData(data);

    const band = await findBandById(bandId);
    const sale = new Sale({ ...data, band, farm: band.farm });
    ensureSaleCanBeMade(band, sale);
    await setSaleCode(sale, band);
    await sale.save();
    await updateBandChickensSalesCount(band, sale);
    await updateDaysRemainingChickensCount(band, sale);

    return findSaleById(sale.id);
  }

  function validateData({ comment, date, quantity, unitPrice, assets }) {
    dataValidator.validateString(comment, 'Sale comment');
    dataValidator.validateDateAsRequired(date, 'Sale date');
    dataValidator.validateNumberAsRequired(quantity, 'Sale quantity');
    dataValidator.validateNumberAsRequired(unitPrice, 'Sale unitPrice');
    dataValidator.validateArray(assets, 'Sale assets');
  }

  function ensureSaleCanBeMade(band, sale) {
    const remainingChickensCount = band.chickensStartCount - band.chickensSalesCount - band.chickensDeathsCount;
    if (sale.quantity > remainingChickensCount) {
      throw new BadRequestError(INVALID_SALE_QUANTITY({ remainingChickensCount }).FR);
    }
  }

  async function setSaleCode(sale, band) {
    const sales = await Sale.find({ band }).sort({ createdAt: -1 }).limit(1);
    let nextSalePosition = 0;
    if (sales.length > 0) {
      nextSalePosition = Number(sales[0].code.slice(2));
    }
    sale.code = 'SA'.concat(String(nextSalePosition + 1).padStart(5, '0'));
  }

  async function updateBandChickensSalesCount(band, sale) {
    band.chickensSalesCount = band.chickensSalesCount + sale.quantity;
    await band.save();
  }

  async function updateDaysRemainingChickensCount(band, sale) {
    const days = await Day.find({ band, date: { $gte: sale.date } });
    await Promise.all(
      days.map((day) => {
        return Day.updateOne({ _id: day.id }, { $inc: { chickensCount: -sale.quantity } });
      })
    );
  }

  return { execute };
};
